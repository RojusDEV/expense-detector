import type { Transaction } from "../types/types";
import { axiosClient } from "./axiosClient";

const LIMIT = 10;

export const getTransactionsRequest = async ({
  offset,
}: {
  offset: number;
}): Promise<{
  data: Transaction[];
  currentPage: number;
  nextPage: number | null;
}> => {
  const pageParam = offset ?? 0;
  const data = await axiosClient.get(
    `${import.meta.env.VITE_BASE_URL}/transactions`,
    { params: { pageParam } },
  );
  const transactions = data.data.transactions;

  return {
    data: transactions,
    currentPage: pageParam,
    nextPage: transactions.length < LIMIT ? null : pageParam + 1,
  };
};
