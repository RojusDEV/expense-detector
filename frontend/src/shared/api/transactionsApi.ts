import type {
  balanceStats,
  latestTransactions,
  monthlyTrends,
  Transaction,
  TransactionsSummary,
} from "../types/types";
import type { TransactionFilters } from "../store/filterStore";
import { format } from "date-fns";
import { axiosClient } from "./axiosClient";
import { myApi } from "./AuthApi";

const LIMIT = 10;

export type TransactionRequestFilters = Partial<TransactionFilters>;

const serializeFilters = (filters: TransactionRequestFilters) =>
  Object.fromEntries(
    Object.entries(filters)
      .filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      )
      .map(([key, value]) => [
        key,
        value instanceof Date ? format(value, "yyyy-MM-dd") : value,
      ]),
  );

export const getTransactionsRequest = async ({
  offset,
  ...filters
}: {
  offset: number;
} & TransactionRequestFilters): Promise<{
  data: {
    transactions: Transaction[];
    transactionsCount: number;
  };
  currentPage: number;
  nextPage: number | null;
}> => {
  const pageParam = offset ?? 0;
  const response = await myApi.get(
    `${import.meta.env.VITE_BASE_URL}/transactions`,
    {
      params: {
        pageParam,
        ...serializeFilters(filters),
      },
    },
  );

  const body = response.data.data;

  return {
    data: body,
    currentPage: pageParam,
    nextPage: body.transactions.length < LIMIT ? null : pageParam + 1,
  };
};

export const getTransactionsSummary =
  async (): Promise<TransactionsSummary> => {
    const { data } = await axiosClient.get(
      `${import.meta.env.VITE_BASE_URL}/transactions/summary`,
    );

    return data;
  };

export const getLatestTransactions = async (): Promise<latestTransactions> => {
  const { data } = await axiosClient.get(
    `${import.meta.env.VITE_BASE_URL}/transactions/latest`,
  );

  return data;
};

export const getBalanceStats = async (): Promise<balanceStats> => {
  const { data } = await axiosClient.get(
    `${import.meta.env.VITE_BASE_URL}/transactions/stats`,
  );

  return data;
};

export const getMonthlyTrends = async (): Promise<monthlyTrends> => {
  const { data } = await axiosClient.get(
    `${import.meta.env.VITE_BASE_URL}/transactions/trends`,
  );

  return data;
};
