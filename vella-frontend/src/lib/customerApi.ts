import axios from "axios";

const customerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

customerApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = JSON.parse(localStorage.getItem("vella-customer-auth") || "{}");
    const token = auth?.state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

customerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("vella-customer-auth");
        window.location.href = "/cuenta/iniciar-sesion";
      }
    }
    return Promise.reject(error);
  }
);

export default customerApi;
