import type { Anomalies } from "../types/types";
import { axiosClient } from "./axiosClient";

export const getAnomalies = async (): Promise<Anomalies[]> => {
  const { data } = await axiosClient.get(
    `${import.meta.env.VITE_BASE_URL}/anomalies`,
  );
  return data;
};
