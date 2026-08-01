import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const myApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const myAuthApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/auth`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Refresh handling

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

const onRefreshed = () => {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
};

myApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/refresh")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push(() => resolve(myApi(originalRequest)));
      });
    }

    isRefreshing = true;

    try {
      await myApi.post("/auth/refresh");
      isRefreshing = false;
      onRefreshed();
      return myApi(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      refreshQueue = [];
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(refreshError);
    }
  }
);


type RegisterPayload = {
  defaultBank: string;
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await myAuthApi.post("/signup", payload);
  return data;
};

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await myAuthApi.post("/signin", payload);
  return data;
};