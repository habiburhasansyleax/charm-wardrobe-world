import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard, Product } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["সব", "ব্রা", "প্যান্টি", "শেপওয়্যার", "ক্যামিসোল", "নাইটওয়্যার"];

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("সব");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("id, name, price, category, image_url, stock")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setProducts(data as Product[]);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "সব" ? products : products.filter((p) => p.category === filter);

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">শপ</p>
          <h1 className="mt-2 font-serif text-4xl font-light">আমাদের কালেকশন</h1>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
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

        {loading ? (
          <p className="text-center text-muted-foreground">লোড হচ্ছে...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">কোন পণ্য পাওয়া যায়নি</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Shop;
