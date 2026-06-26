import type { AxiosInstance } from "axios";
import axios from "axios";

export const axiosClient: AxiosInstance = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
  });
})();

export const axiosFileClient: AxiosInstance = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
    timeout: 10000,
  });
})();
