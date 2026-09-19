import ProductGrid from "@/components/catalog/ProductGrid";
import CategoryBadge from "@/components/catalog/CategoryBadge";
import HeroBanner from "@/components/home/HeroBanner";
import { getCategories, getProducts } from "@/lib/catalog";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <HeroBanner />

      {categories.length > 0 && (
        <section className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-vella-wine to-vella-navy px-6 py-4">
          {categories.map((category) => (
            <CategoryBadge key={category.id} category={category} />
          ))}
        </section>
      )}

      <section id="productos" className="flex flex-col gap-4">
        <h2 className="text-xl">Productos destacados</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
