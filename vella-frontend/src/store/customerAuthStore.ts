import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Customer } from "@/types";

interface CustomerAuthState {
  token: string | null;
  customer: Customer | null;
  isAuthenticated: boolean;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      token: null,
      customer: null,
      isAuthenticated: false,
      login: (token, customer) =>
        set({ token, customer, isAuthenticated: true }),
      logout: () =>
        set({ token: null, customer: null, isAuthenticated: false }),
    }),
    { name: "vella-customer-auth" }
  )
);
