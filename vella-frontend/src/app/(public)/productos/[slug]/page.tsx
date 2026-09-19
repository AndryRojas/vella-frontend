import Image from "next/image";
import { notFound } from "next/navigation";
import api from "@/lib/api";
import { Product } from "@/types";
import { formatCOP } from "@/lib/utils";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data } = await api.get<Product>(`/products/${slug}`);
    return data;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-vella-cream">
        {product.primaryImageUrl ? (
          <Image
            src={product.primaryImageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-vella-navy/40">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {product.categoryName && (
          <span className="w-fit rounded-full border border-vella-gold/30 bg-vella-gold/10 px-2 py-0.5 text-xs font-medium text-vella-gold">
            {product.categoryName}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl">{product.name}</h1>
        <p className="text-xl font-semibold text-vella-navy">
          {formatCOP(product.price)}
        </p>
        <p className="whitespace-pre-line text-sm leading-6 text-vella-navy/70">
          {product.description}
        </p>
      </div>
    </div>
  );
}
