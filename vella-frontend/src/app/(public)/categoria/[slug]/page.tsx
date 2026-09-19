import { notFound } from "next/navigation";
import ProductGrid from "@/components/catalog/ProductGrid";
import CategoryBadge from "@/components/catalog/CategoryBadge";
import { getCategories, getProducts } from "@/lib/catalog";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts(slug);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl">{category.name}</h1>
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <CategoryBadge key={c.id} category={c} active={c.slug === slug} />
          ))}
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
