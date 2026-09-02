import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import { endOfDay, format, isValid, parseISO, startOfDay } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import {
  getTransactionsRequest,
  type TransactionRequestFilters,
} from "@/shared/api/transactionsApi";
import TransactionsFilters from "../components/TransactionsFilters";
import { useFilterStore } from "@/shared/store/filterStore";
import TransactionsSkeleton from "../components/TransactionsSkeleton";
import { capitalize, colors } from "@/lib/utils";

export const TransactionsPage = () => {
  const filters = useFilterStore((state) => state.filters);
  const setFilters = useFilterStore((state) => state.setFilters);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersReady, setFiltersReady] = useState(false);
  const lastFetchedFilters = useRef<TransactionRequestFilters | undefined>(
    undefined,
  );
  const loadedDateBounds = useRef<
    { oldest: number; newest: number } | undefined
  >(undefined);

  useEffect(() => {
    const parseDate = (value: string | null) => {
      if (!value) return undefined;
      const date = parseISO(value);
      return isValid(date) ? date : undefined;
    };
    const parseAmount = (value: string | null) => {
      if (!value) return null;
      const amount = Number(value);
      return Number.isFinite(amount) ? amount : null;
    };

    setFilters({
      fromDate: parseDate(searchParams.get("from")),
      toDate: parseDate(searchParams.get("to")),
      minAmount: parseAmount(searchParams.get("min")),
      maxAmount: parseAmount(searchParams.get("max")),
      search: searchParams.get("search") || null,
    });
    setFiltersReady(true);
  }, [searchParams, setFilters]);

  useEffect(() => {
    if (!filtersReady) return;

    const nextParams = new URLSearchParams();
    if (filters.search?.trim()) nextParams.set("search", filters.search.trim());
    if (filters.fromDate) nextParams.set("from", format(filters.fromDate, "yyyy-MM-dd"));
    if (filters.toDate) nextParams.set("to", format(filters.toDate, "yyyy-MM-dd"));
    if (filters.minAmount !== null) nextParams.set("min", String(filters.minAmount));
    if (filters.maxAmount !== null) nextParams.set("max", String(filters.maxAmount));

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters, filtersReady, searchParams, setSearchParams]);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: filters.search?.trim() ?? "",
    }),
    [filters],
  );

  const sameNonDateFilters =
    lastFetchedFilters.current &&
    JSON.stringify({
      ...lastFetchedFilters.current,
      fromDate: undefined,
      toDate: undefined,
    }) ===
      JSON.stringify({
        ...queryFilters,
        fromDate: undefined,
        toDate: undefined,
      });

  const dateRangeIsLoaded =
    loadedDateBounds.current &&
    sameNonDateFilters &&
    (filters.fromDate === undefined ||
      startOfDay(filters.fromDate).getTime() >=
        loadedDateBounds.current.oldest) &&
    (filters.toDate === undefined ||
      endOfDay(filters.toDate).getTime() <= loadedDateBounds.current.newest);

  const requestFilters = dateRangeIsLoaded
    ? lastFetchedFilters.current!
    : queryFilters;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    error,
    status,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["transactions", requestFilters],
    queryFn: async ({ pageParam }) => {
      const isNewFilterRequest =
        JSON.stringify(lastFetchedFilters.current) !==
        JSON.stringify(requestFilters);

      if (isNewFilterRequest) loadedDateBounds.current = undefined;
      lastFetchedFilters.current = requestFilters;
      const page = await getTransactionsRequest({
        offset: pageParam,
        ...requestFilters,
      });
      const pageDates = page.data.transactions.map((transaction) =>
        new Date(transaction.transactionDate).getTime(),
      );

      if (pageDates.length) {
        loadedDateBounds.current = {
          oldest: Math.min(
            loadedDateBounds.current?.oldest ?? Infinity,
            ...pageDates,
          ),
          newest: Math.max(
            loadedDateBounds.current?.newest ?? -Infinity,
            ...pageDates,
          ),
        };
      }

      return page;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: filtersReady,
    staleTime: 1000 * 60 * 5,
  });

  const flattenedTransactions = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.transactions) : []),
    [data],
  );

  const displayedTransactions = dateRangeIsLoaded
    ? flattenedTransactions.filter((transaction) => {
        const transactionTime = new Date(transaction.transactionDate).getTime();
        return (
          (!filters.fromDate ||
            transactionTime >= startOfDay(filters.fromDate).getTime()) &&
          (!filters.toDate ||
            transactionTime <= endOfDay(filters.toDate).getTime())
        );
      })
    : flattenedTransactions;
  const observer = useRef<IntersectionObserver | undefined>(undefined);

  const lastElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  if (status === "error")
    return <span className="font-bold text-red-500">{error.message}</span>;
  if (status === "pending") return <TransactionsSkeleton />;

  const latestTransactionDate =
    data?.pages[0]?.data.transactions[0].transactionDate;

  return (
    <div className="bg-(--bg-primary-dashboard) px-8 py-7">
      <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
        Transakcijos
      </h1>
      <h2 className="mt-2 mb-5 font-normal text-(--text-gray-400)">
        {data?.pages[0]?.data.transactionsCount ?? 0} transakcijos ·{" "}
        {latestTransactionDate
          ? format(new Date(latestTransactionDate), "yyyy-MM")
          : "-"}
      </h2>
      <TransactionsFilters />
      <div className="mt-4 max-w-screen overflow-auto rounded-lg border-2 border-(--input-outline) bg-(--card-background) p-5">
        <table className="w-full max-w-screen min-w-175 text-sm text-(--text-primary-white)">
          <thead>
            <tr className="border-b border-(--input-outline) text-left text-(--text-gray-400)">
              <th className="pr-4 pb-3 font-medium">Data</th>
              <th className="pr-4 pb-3 font-medium">Prekybininkas</th>
              <th className="pr-4 pb-3 font-medium">Kategorija</th>
              <th className="pr-4 pb-3 font-medium">Aprašymas</th>
              <th className="pb-3 font-medium">Suma</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--input-outline)">
            {displayedTransactions.map((transaction, index) => {
              const isLast = index === displayedTransactions.length - 1;
              const {
                id,
                amount,
                categoryName,
                merchantName,
                rawDescription,
                transactionDate,
                isExpense,
              } = transaction;
              return (
                <tr key={id} ref={isLast ? lastElementRef : null}>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {transactionDate
                      ? format(new Date(transactionDate), "yyyy-MM-dd")
                      : "-"}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {capitalize(merchantName)}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${categoryName ? colors[categoryName] : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {categoryName !== null
                        ? capitalize(categoryName)
                        : "Nenustatyta"}
                    </span>
                  </td>
                  <td className="font-outfit max-w-0 truncate py-3 pr-4 whitespace-nowrap text-(--text-gray-400)">
                    {rawDescription}
                  </td>
                  <td
                    className={`font-brains py-3 font-bold ${isExpense ? "text-[#F87171]" : "text-[#34D399]"} whitespace-nowrap`}
                  >
                    {(!isExpense ? "+" : "") + "€" + amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isFetchingNextPage && <span>Kraunama....</span>}
      </div>
    </div>
  );
};
