"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import customerApi from "@/lib/customerApi";
import { Customer } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Correo inválido"),
  phone: z.string().optional(),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await customerApi.post<Customer>("/customers/register", {
        ...values,
        storeSlug: process.env.NEXT_PUBLIC_STORE_SLUG,
      });
      router.push(`/cuenta/verificar?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setServerError(message ?? "No se pudo crear la cuenta");
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <Card className="w-full max-w-sm border-vella-gold/20">
        <CardHeader>
          <h1 className="text-center text-xl">Crear cuenta</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                autoComplete="name"
                aria-invalid={!!errors.fullName}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-red-600">{errors.fullName.message}</p>
              )}
            </div>
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
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <Input id="phone" autoComplete="tel" {...register("phone")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
            {serverError && <p className="text-sm text-red-600">{serverError}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-10 w-full bg-vella-wine text-white hover:bg-vella-wine-light"
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-vella-navy/70">
            ¿Ya tienes cuenta?{" "}
            <Link href="/cuenta/iniciar-sesion" className="text-vella-wine hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
