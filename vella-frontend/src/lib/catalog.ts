import api from "@/lib/api";
import { Category, Product } from "@/types";

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const { data } = await api.get<Product[]>("/products", {
      params: {
        store: process.env.NEXT_PUBLIC_STORE_SLUG,
        category: categorySlug,
      },
    });
    return data;
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await api.get<Category[]>("/categories", {
      params: { store: process.env.NEXT_PUBLIC_STORE_SLUG },
    });
    return data;
  } catch {
    return [];
  }
}
