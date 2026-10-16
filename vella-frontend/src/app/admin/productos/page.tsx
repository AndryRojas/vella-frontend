"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types";
import { downloadCsv, formatCOP, normalizeForSearch } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 10;

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    return api
      .get<Product[]>("/admin/products", {
        params: { store: process.env.NEXT_PUBLIC_STORE_SLUG },
      })
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const load = () => {
    setLoading(true);
    fetchProducts();
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm("¿Desactivar este producto?")) return;
    await api.delete(`/admin/products/${id}`);
    load();
  };

  const handleActivate = async (id: number) => {
    await api.put(`/admin/products/${id}/activate`);
    load();
  };

  const handleExportCsv = () => {
    const activeProducts = products.filter((product) => product.active);
    downloadCsv(
      `productos-activos-${process.env.NEXT_PUBLIC_STORE_SLUG}.csv`,
      ["ID", "Nombre", "Slug", "Descripción", "Categoría", "Precio", "Stock", "URL imagen principal"],
      activeProducts.map((product) => [
        product.id,
        product.name,
        product.slug,
        product.description,
        product.categoryName,
        product.price,
        product.stock,
        product.primaryImageUrl,
      ])
    );
  };

  const filteredProducts = products.filter((product) =>
    normalizeForSearch(product.name).includes(normalizeForSearch(search))
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageItems = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Productos</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportCsv}
            disabled={loading || products.every((product) => !product.active)}
            className={buttonVariants({
              variant: "outline",
              className: "border-vella-wine text-vella-wine hover:bg-vella-wine/10 disabled:opacity-40",
            })}
          >
            Exportar CSV
          </button>
          <Link
            href="/admin/productos/nuevo"
            className={buttonVariants({
              className: "bg-vella-wine text-white hover:bg-vella-wine-light",
            })}
          >
            Nuevo producto
          </Link>
        </div>
      </div>

      <Input
        type="text"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Buscar producto por nombre..."
        className="max-w-sm"
      />

      <div className="rounded-lg border border-vella-gold/20 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-vella-navy/60">
                  {search ? "No hay productos que coincidan con la búsqueda." : "No hay productos todavía."}
                </TableCell>
              </TableRow>
            )}
            {pageItems.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded bg-vella-cream">
                    {product.primaryImageUrl && (
                      <Image
                        src={product.primaryImageUrl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-vella-navy">
                  {product.name}
                </TableCell>
                <TableCell className="text-vella-navy/70">
                  {product.categoryName ?? "—"}
                </TableCell>
                <TableCell>{formatCOP(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <span
                    className={
                      product.active
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700"
                        : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500"
                    }
                  >
                    {product.active ? "Activo" : "Inactivo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="text-sm text-vella-wine hover:underline"
                    >
                      Editar
                    </Link>
                    {product.active ? (
                      <button
                        onClick={() => handleDeactivate(product.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(product.id)}
                        className="text-sm text-emerald-700 hover:underline"
                      >
                        Activar
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm text-vella-navy">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
