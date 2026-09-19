"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Store } from "@/types";

export function useCurrentStore() {
  const [storeId, setStoreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Store[]>("/stores")
      .then(({ data }) => {
        const store = data.find(
          (s) => s.slug === process.env.NEXT_PUBLIC_STORE_SLUG
        );
        setStoreId(store?.id ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { storeId, loading };
}
