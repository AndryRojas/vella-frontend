"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const verifySchema = z.object({
  code: z.string().length(6, "El código tiene 6 dígitos"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const login = useCustomerAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (values: VerifyFormValues) => {
    setServerError(null);
    try {
      const { data } = await customerApi.post<CustomerAuthResponse>("/customers/verify-email", {
        email,
        code: values.code,
        storeSlug: process.env.NEXT_PUBLIC_STORE_SLUG,
      });
      login(data.token, data.customer);
      router.push("/");
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setServerError(message ?? "No se pudo verificar el código");
    }
  };

  const handleResend = async () => {
    setServerError(null);
    setResendMessage(null);
    setResending(true);
    try {
      await customerApi.post("/customers/resend-code", {
        email,
        storeSlug: process.env.NEXT_PUBLIC_STORE_SLUG,
      });
      setResendMessage("Te enviamos un nuevo código.");
    } catch (err) {
      const message =
        err instanceof AxiosError ? err.response?.data?.message : undefined;
      setServerError(message ?? "No se pudo reenviar el código");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <Card className="w-full max-w-sm border-vella-gold/20">
        <CardHeader>
          <h1 className="text-center text-xl">Verifica tu correo</h1>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center text-sm text-vella-navy/70">
            Enviamos un código de 6 dígitos a <span className="font-medium">{email}</span>.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">Código de verificación</Label>
              <Input
                id="code"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                aria-invalid={!!errors.code}
                {...register("code")}
              />
              {errors.code && (
                <p className="text-xs text-red-600">{errors.code.message}</p>
              )}
            </div>
            {serverError && <p className="text-sm text-red-600">{serverError}</p>}
            {resendMessage && <p className="text-sm text-emerald-700">{resendMessage}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-10 w-full bg-vella-wine text-white hover:bg-vella-wine-light"
            >
              {isSubmitting ? "Verificando..." : "Verificar"}
            </Button>
          </form>
          <button
            onClick={handleResend}
            disabled={resending}
            className="mt-4 w-full text-center text-sm text-vella-wine hover:underline disabled:opacity-40"
          >
            {resending ? "Enviando..." : "Reenviar código"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
