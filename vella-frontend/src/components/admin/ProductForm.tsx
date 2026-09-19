"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product, ProductRequest } from "@/types";
import { slugify } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { useCurrentStore } from "@/hooks/useCurrentStore";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const productSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Debe ser mayor a 0"),
  stock: z.coerce.number().int().min(0),
  categoryId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().optional()
  ),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormValues = z.output<typeof productSchema>;

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (values: ProductRequest) => Promise<void>;
  submitLabel?: string;
}

export function ProductForm({
  initialProduct,
  onSubmit,
  submitLabel = "Guardar",
}: ProductFormProps) {
  const router = useRouter();
  const { categories } = useCategories();
  const { storeId } = useCurrentStore();
  const [images, setImages] = useState<string[]>(
    initialProduct?.imageUrls ?? []
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const initialCategoryId = categories.find(
    (c) => c.slug === initialProduct?.categorySlug
  )?.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    values: initialProduct
      ? {
          name: initialProduct.name,
          slug: initialProduct.slug,
          description: initialProduct.description ?? "",
          price: initialProduct.price,
          stock: initialProduct.stock,
          categoryId: initialCategoryId,
        }
      : undefined,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
    },
  });

  const handleFormSubmit = async (values: ProductFormValues) => {
    if (!storeId) {
      setServerError("No se pudo determinar la tienda.");
      return;
    }
    setServerError(null);
    try {
      const payload: ProductRequest = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        price: values.price,
        stock: values.stock,
        storeId,
        categoryId: values.categoryId ?? null,
        imageUrls: images,
      };
      await onSubmit(payload);
    } catch {
      setServerError("No se pudo guardar el producto.");
    }
  };

  return (
    <Card className="max-w-2xl border-vella-gold/20">
      <CardHeader />
      <CardContent>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                if (!initialProduct) {
                  setValue("slug", slugify(e.target.value), {
                    shouldValidate: true,
                  });
                }
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

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              rows={4}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-red-600">{errors.price.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" min="0" {...register("stock")} />
              {errors.stock && (
                <p className="text-xs text-red-600">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="categoryId">Categoría</Label>
            <select
              id="categoryId"
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("categoryId")}
            >
              <option value="">Sin categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Imágenes</Label>
            <ImageUploader value={images} onChange={setImages} />
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/productos")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-vella-wine text-white hover:bg-vella-wine-light"
            >
              {isSubmitting ? "Guardando..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
