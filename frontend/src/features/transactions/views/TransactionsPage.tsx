import { useRef, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getTransactionsRequest } from "@/shared/api/transactionsApi";
import { capitalize, colors } from "@/lib/utils";
import TransactionsFilters from "../components/TransactionsFilters";

export const TransactionsPage = () => {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["transactions"],
    queryFn: ({ pageParam }) => getTransactionsRequest({ offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });

  const flattenedData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data) : []),
    [data],
  );

  const categorySet = useMemo(
    () => new Set(flattenedData.map((t) => t.categoryName)),
    [flattenedData],
  );

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
  if (status === "pending")
    return <span className="font-bold text-yellow-300">Loading...</span>;

  return (
    <div className="w-full bg-(--bg-primary-dashboard) px-8 py-7">
      <h1 className="font-playfair text-2xl leading-[120%] font-medium text-(--text-primary-white)">
        Transakcijos
      </h1>
      <h2 className="mt-2 mb-5 font-normal text-(--text-gray-400)">
        {flattenedData.length} transakcijos · Sausis 2025
      </h2>
      <TransactionsFilters />
      <div className="mt-4 overflow-hidden rounded-lg border-2 border-(--input-outline) bg-(--card-background) p-5">
        <table className="w-full table-fixed text-sm text-(--text-primary-white)">
          <thead>
            <tr className="border-b border-(--input-outline) text-left text-(--text-gray-400)">
              <th className="pr-4 pb-3 font-medium">Data</th>
              <th className="pr-4 pb-3 font-medium">Prekybininkas</th>
              <th className="pr-4 pb-3 font-medium">Kategorija</th>
              <th className="pr-4 pb-3 font-medium">Aprašymas</th>
              <th className="pb-3 font-medium">Suma</th>
            </tr>
          </thead>
          <tbody>
            {flattenedData.map((transaction, index) => {
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
                <tr
                  key={id}
                  ref={isLast ? lastElementRef : null}
                  className="border-b border-(--input-outline)"
                >
                  <td className="py-3 pr-4">
                    {transactionDate
                      ? format(new Date(transactionDate), "yyyy-MM-dd")
                      : "-"}
                  </td>
                  <td className="py-3 pr-4">{capitalize(merchantName)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${categoryName ? colors[categoryName] : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {categoryName !== null
                        ? capitalize(categoryName)
                        : "Nenustatyta"}
                    </span>
                  </td>
                  <td className="font-outfit max-w-0 truncate py-3 pr-4 text-(--text-gray-400)">
                    {rawDescription}
                  </td>
                  <td
                    className={`font-brains py-3 font-bold ${isExpense ? "text-[#F87171]" : "text-[#34D399]"}`}
                  >
                    {(!isExpense ? "+" : "") + "€" + amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isFetchingNextPage && (
          <p className="mt-3 text-center text-sm text-(--text-gray-400)">
            Kraunama...
          </p>
        )}
      </div>
    </div>
  );
};
