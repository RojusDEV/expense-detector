import type { Merchant } from "../types/types";
import { axiosClient } from "./axiosClient";

export const getMerchantList = async (): Promise<Merchant[]> => {
  const data = await axiosClient.get(`${import.meta.env.VITE_BASE_URL}/merchants`);
  return data.data;
};
