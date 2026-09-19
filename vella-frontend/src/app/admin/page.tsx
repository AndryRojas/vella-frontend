"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Category, Product } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const store = process.env.NEXT_PUBLIC_STORE_SLUG;
    Promise.all([
      api.get<Product[]>("/admin/products", { params: { store } }),
      api.get<Category[]>("/categories", { params: { store } }),
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeProducts = products.filter((p) => p.active).length;
  const outOfStock = products.filter((p) => p.active && p.stock === 0).length;

  const stats = [
    { label: "Productos activos", value: activeProducts },
    { label: "Categorías", value: categories.length },
    { label: "Sin stock", value: outOfStock },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">Panel de Administración</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-vella-gold/30">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-vella-navy">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-vella-wine">
                {loading ? "—" : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
