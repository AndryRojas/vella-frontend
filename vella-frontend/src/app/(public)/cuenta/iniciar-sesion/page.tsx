"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import customerApi from "@/lib/customerApi";
import { CustomerAuthResponse } from "@/types";
import { useCustomerAuthStore } from "@/store/customerAuthStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function CustomerLoginPage() {
  const router = useRouter();
  const login = useCustomerAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setUnverifiedEmail(null);
    try {
      const { data } = await customerApi.post<CustomerAuthResponse>("/customers/login", {
        ...values,
        storeSlug: process.env.NEXT_PUBLIC_STORE_SLUG,
      });
      login(data.token, data.customer);
      router.push("/");
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setServerError(message ?? "Credenciales inválidas");
      if (message?.toLowerCase().includes("verificar")) {
        setUnverifiedEmail(values.email);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <Card className="w-full max-w-sm border-vella-gold/20">
        <CardHeader>
          <h1 className="text-center text-xl">Iniciar sesión</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
            {serverError && <p className="text-sm text-red-600">{serverError}</p>}
            {unverifiedEmail && (
              <Link
                href={`/cuenta/verificar?email=${encodeURIComponent(unverifiedEmail)}`}
                className="text-sm text-vella-wine hover:underline"
              >
                Verifica tu cuenta aquí
              </Link>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-10 w-full bg-vella-wine text-white hover:bg-vella-wine-light"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-vella-navy/70">
            ¿No tienes cuenta?{" "}
            <Link href="/cuenta/registro" className="text-vella-wine hover:underline">
              Créala aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
