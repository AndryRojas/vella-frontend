import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatCOP } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-vella-gold/20 bg-white transition-all hover:border-vella-gold/60 hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-vella-cream">
        {product.primaryImageUrl ? (
          <Image
            src={product.primaryImageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-vella-navy/40">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.categoryName && (
          <span className="w-fit rounded-full border border-vella-gold/30 bg-vella-gold/10 px-2 py-0.5 text-xs font-medium text-vella-gold">
            {product.categoryName}
          </span>
        )}
        <h3 className="line-clamp-2 font-serif text-base text-vella-wine">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-vella-navy">
          {formatCOP(product.price)}
        </p>
        <span className="mt-auto w-fit rounded-full bg-vella-wine px-4 py-1.5 text-xs font-medium text-white transition-colors group-hover:bg-vella-wine-light">
          Ver producto
        </span>
      </div>
    </Link>
  );
}
