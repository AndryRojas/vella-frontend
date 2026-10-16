"use client";

import Link from "next/link";
import { useCustomerAuthStore } from "@/store/customerAuthStore";

export default function CustomerNavLinks() {
  const { customer, isAuthenticated } = useCustomerAuthStore((state) => state);

  if (isAuthenticated && customer) {
    return (
      <Link href="/cuenta" className="transition-colors hover:text-vella-wine">
        Hola, {customer.fullName.split(" ")[0]}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/cuenta/iniciar-sesion" className="transition-colors hover:text-vella-wine">
        Iniciar sesión
      </Link>
      <Link href="/cuenta/registro" className="transition-colors hover:text-vella-wine">
        Crear cuenta
      </Link>
    </div>
  );
}
