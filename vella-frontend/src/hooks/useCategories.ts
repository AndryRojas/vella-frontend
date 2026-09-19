"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(() => {
    return api
      .get<Category[]>("/categories", {
        params: { store: process.env.NEXT_PUBLIC_STORE_SLUG },
      })
      .then(({ data }) => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    setLoading(true);
    return fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, refetch };
}
