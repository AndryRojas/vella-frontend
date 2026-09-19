"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ProductRequest } from "@/types";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NuevoProductoPage() {
  const router = useRouter();

  const handleSubmit = async (values: ProductRequest) => {
    await api.post("/admin/products", values);
    router.push("/admin/productos");
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">Nuevo producto</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Crear producto" />
    </div>
  );
}
