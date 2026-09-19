"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { CategoryRequest } from "@/types";
import { slugify } from "@/lib/utils";
import { useCurrentStore } from "@/hooks/useCurrentStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const categorySchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const { storeId } = useCurrentStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "" },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    if (!storeId) {
      setServerError("No se pudo determinar la tienda.");
      return;
    }
    setServerError(null);
    try {
      const payload: CategoryRequest = { ...values, storeId };
      await api.post("/categories", payload);
      router.push("/admin/categorias");
    } catch {
      setServerError("No se pudo crear la categoría.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">Nueva categoría</h1>

      <Card className="max-w-md border-vella-gold/20">
        <CardHeader />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  setValue("slug", slugify(e.target.value), {
                    shouldValidate: true,
                  });
                }}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && (
                <p className="text-xs text-red-600">{errors.slug.message}</p>
              )}
            </div>
            {serverError && <p className="text-sm text-red-600">{serverError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/categorias")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-vella-wine text-white hover:bg-vella-wine-light"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
