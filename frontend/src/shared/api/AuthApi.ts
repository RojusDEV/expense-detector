import axios from "axios";

export const myApi = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const myAuthApi = axios.create({
  baseURL: "http://localhost:8000/api/auth",
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

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
