import { create } from "zustand";

export type TransactionFilters = {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  minAmount: number | null;
  maxAmount: number | null;
  search: string | null;
};

const defaultFilters: TransactionFilters = {
  fromDate: undefined,
  toDate: undefined,
  minAmount: null,
  maxAmount: null,
  search: null
};

type Store = {
  filters: TransactionFilters;

  setFilter: <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K],
  ) => void;

  setFilters: (filters: TransactionFilters) => void;

  clearFilters: () => void;
};

export const useFilterStore = create<Store>((set) => ({
  filters: defaultFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  setFilters: (filters) => set({ filters }),

  clearFilters: () => set({ filters: defaultFilters }),
}));
