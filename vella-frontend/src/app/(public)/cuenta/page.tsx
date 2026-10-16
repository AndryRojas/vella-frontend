"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuthStore } from "@/store/customerAuthStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerAccountPage() {
  const router = useRouter();
  const { customer, isAuthenticated, logout } = useCustomerAuthStore((state) => state);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/cuenta/iniciar-sesion");
    }
  }, [isAuthenticated, router]);

  if (!customer) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <Card className="w-full max-w-sm border-vella-gold/20">
        <CardHeader>
          <h1 className="text-center text-xl">Mi cuenta</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-vella-navy/60">Nombre</p>
            <p className="font-medium text-vella-navy">{customer.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-vella-navy/60">Correo</p>
            <p className="font-medium text-vella-navy">{customer.email}</p>
          </div>
          {customer.phone && (
            <div>
              <p className="text-sm text-vella-navy/60">Teléfono</p>
              <p className="font-medium text-vella-navy">{customer.phone}</p>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-2 h-10 w-full border-vella-wine text-vella-wine hover:bg-vella-wine/10"
          >
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
