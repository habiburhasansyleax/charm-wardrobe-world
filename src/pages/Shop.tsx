import { useEffect, useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filter, setFilter] = useState("সব");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(50)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.node.productType && set.add(p.node.productType));
    return ["সব", ...Array.from(set)];
  }, [products]);

  const filtered =
    filter === "সব" ? products : products.filter((p) => p.node.productType === filter);

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">শপ</p>
          <h1 className="mt-2 font-serif text-4xl font-light">আমাদের কালেকশন</h1>
        </div>

        {categories.length > 1 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Button
                key={c}
                variant={filter === c ? "default" : "outline"}
                size="sm"
                className="rounded-none"
                onClick={() => setFilter(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-muted-foreground">লোড হচ্ছে...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">No products found</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Shop;
