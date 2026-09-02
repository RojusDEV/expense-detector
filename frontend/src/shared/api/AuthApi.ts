import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  refreshQueue = [];
};

myApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/refresh")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: () => {
            resolve(myApi(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      await myAuthApi.post("/refresh");

      useAuthStore.getState().setAuthenticated(true);

      isRefreshing = false;
      processQueue();

      return myApi(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError);

      useAuthStore.getState().clearAuth();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(refreshError);
    }
  },
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


export const signoutApi = async () => {
  return await myAuthApi.post("/signout");
};
