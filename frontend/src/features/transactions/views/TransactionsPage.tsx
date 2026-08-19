import { useRef, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getTransactionsRequest } from "@/shared/api/transactionsApi";
import TransactionsFilters from "../components/TransactionsFilters";
import { useFilterStore } from "@/shared/store/filterStore";
import TransactionsSkeleton from "../components/TransactionsSkeleton";
import { capitalize, colors } from "@/lib/utils";

export const TransactionsPage = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    status,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["transactions"],
    queryFn: ({ pageParam }) => getTransactionsRequest({ offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });

  const filters = useFilterStore((state) => state.filters);

  const flattenedData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data) : []),
    [data],
  );

  const filteredData = useMemo(() => {
    return flattenedData.filter((t) => {
      const txDate = new Date(t.transactionDate);

      if (filters.fromDate && txDate < filters.fromDate) return false;
      if (filters.toDate && txDate > filters.toDate) return false;
      if (filters.minAmount !== null && t.amount < filters.minAmount)
        return false;
      if (filters.maxAmount !== null && t.amount > filters.maxAmount)
        return false;
      if (
        filters.search &&
        !t.merchantName?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.rawDescription?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [flattenedData, filters]);

  const observer = useRef<IntersectionObserver | undefined>(undefined);

  const lastElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetching, fetchNextPage],
  );

  if (status === "error")
    return <span className="font-bold text-red-500">{error.message}</span>;
  if (status === "pending") return <TransactionsSkeleton />;

  return (
    <div className="bg-(--bg-primary-dashboard) px-8 py-7">
      <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
        Transakcijos
      </h1>
      <h2 className="mt-2 mb-5 font-normal text-(--text-gray-400)">
        {flattenedData.length} transakcijos · Sausis 2025
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
            {filteredData.map((transaction, index) => {
              const isLast = index === flattenedData.length - 1;
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
