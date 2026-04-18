import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft } from "lucide-react";

type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  image_url: string | null;
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProduct(data as ProductDetail);
          if (data.sizes?.length) setSize(data.sizes[0]);
          if (data.colors?.length) setColor(data.colors[0]);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Layout><p className="container py-20 text-center text-muted-foreground">লোড হচ্ছে...</p></Layout>;
  if (!product) return <Layout><p className="container py-20 text-center">পণ্য পাওয়া যায়নি</p></Layout>;

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <Link to="/shop" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> শপে ফিরে যান
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden bg-muted">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">{product.category}</p>
              <h1 className="mt-2 font-serif text-4xl font-light">{product.name}</h1>
              <p className="mt-3 text-2xl text-primary">৳ {Number(product.price).toLocaleString()}</p>
            </div>

            {product.description && (
              <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            )}

            {product.sizes?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">সাইজ</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <Button
                      key={s}
                      variant={size === s ? "default" : "outline"}
                      size="sm"
                      className="rounded-none"
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium">রঙ</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <Button
                      key={c}
                      variant={color === c ? "default" : "outline"}
                      size="sm"
                      className="rounded-none"
                      onClick={() => setColor(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                size="lg"
                className="w-full rounded-none"
                disabled={product.stock === 0}
                onClick={() => addToCart(product.id, size, color)}
              >
                {product.stock === 0 ? "স্টকে নেই" : "কার্টে যোগ করুন"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                ডিসক্রিট প্যাকেজিং • ক্যাশ অন ডেলিভারি
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
