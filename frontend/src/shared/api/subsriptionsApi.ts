import type { Subscription } from "../types/types";
import { axiosClient } from "./axiosClient";

export const getSubscriptionsRequest = async (): Promise<Subscription[]> => {
  const data = await axiosClient.get(
    `${import.meta.env.VITE_BASE_URL}/subscriptions`,
  );
  return data.data;
};
