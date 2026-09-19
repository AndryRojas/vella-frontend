"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import api from "@/lib/api";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminCategoriasPage() {
  const { categories, loading, refetch } = useCategories();

  const handleDeactivate = async (id: number) => {
    if (!confirm("¿Desactivar esta categoría?")) return;
    await api.delete(`/categories/${id}`);
    refetch();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Categorías</h1>
        <Link
          href="/admin/categorias/nueva"
          className={buttonVariants({
            className: "bg-vella-wine text-white hover:bg-vella-wine-light",
          })}
        >
          Nueva categoría
        </Link>
      </div>

      <div className="rounded-lg border border-vella-gold/20 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-vella-navy/60">
                  No hay categorías todavía.
                </TableCell>
              </TableRow>
            )}
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-vella-navy">
                  {category.name}
                </TableCell>
                <TableCell className="text-vella-navy/70">{category.slug}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                    Activo
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDeactivate(category.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Desactivar
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
