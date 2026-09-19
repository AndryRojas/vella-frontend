"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Product, ProductRequest } from "@/types";
import { ProductForm } from "@/components/admin/ProductForm";

export default function EditProductClient({ id }: { id: number }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null | undefined>(
    undefined
  );

  useEffect(() => {
    api
      .get<Product[]>("/admin/products", {
        params: { store: process.env.NEXT_PUBLIC_STORE_SLUG },
      })
      .then(({ data }) => {
        setProduct(data.find((p) => p.id === id) ?? null);
      });
  }, [id]);

  const handleSubmit = async (values: ProductRequest) => {
    await api.put(`/admin/products/${id}`, values);
    router.push("/admin/productos");
  };

  if (product === undefined) {
    return <p className="text-vella-navy/60">Cargando...</p>;
  }

  if (product === null) {
    return <p className="text-vella-navy/60">Producto no encontrado.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">Editar producto</h1>
      <ProductForm
        initialProduct={product}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
