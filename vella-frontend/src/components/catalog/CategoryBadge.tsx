import Link from "next/link";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

export default function CategoryBadge({
  category,
  active = false,
}: {
  category: Category;
  active?: boolean;
}) {
  return (
    <Link
      href={`/categoria/${category.slug}`}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-vella-gold text-white"
          : "bg-vella-champagne text-vella-wine hover:bg-vella-gold-light"
      )}
    >
      {category.name}
    </Link>
  );
}
