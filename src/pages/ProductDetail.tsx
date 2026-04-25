import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id: handle } = useParams();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!handle) return;
    fetchProductByHandle(handle)
      .then((p) => {
        setProduct(p);
        if (p) {
          const initial: Record<string, string> = {};
          p.options.forEach((o) => {
            if (o.values[0]) initial[o.name] = o.values[0];
          });
          setSelectedOptions(initial);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading)
    return (
      <Layout>
        <p className="container py-20 text-center text-muted-foreground">লোড হচ্ছে...</p>
      </Layout>
    );
  if (!product)
    return (
      <Layout>
        <p className="container py-20 text-center">পণ্য পাওয়া যায়নি</p>
      </Layout>
    );

  const matchedVariant =
    product.variants.edges.find((v) =>
      v.node.selectedOptions.every((o) => selectedOptions[o.name] === o.value)
    )?.node || product.variants.edges[0]?.node;

  const image = product.images.edges[0]?.node;
  const price = matchedVariant?.price || product.priceRange.minVariantPrice;

  const handleAdd = async () => {
    if (!matchedVariant) return;
    await addItem({
      product: { node: product },
      variantId: matchedVariant.id,
      variantTitle: matchedVariant.title,
      price: matchedVariant.price,
      quantity: 1,
      selectedOptions: matchedVariant.selectedOptions,
    });
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <Link
          to="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> শপে ফিরে যান
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden bg-muted">
            {image && (
              <img src={image.url} alt={image.altText || product.title} className="h-full w-full object-cover" />
            )}
          </div>

          <div className="space-y-6">
            <div>
              {product.productType && (
                <p className="text-xs uppercase tracking-[0.3em] text-primary">{product.productType}</p>
              )}
              <h1 className="mt-2 font-serif text-4xl font-light">{product.title}</h1>
              <p className="mt-3 text-2xl text-primary">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </p>
            </div>

            {product.description && (
              <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            )}

            {product.options.map((opt) =>
              opt.values.length > 1 ? (
                <div key={opt.name}>
                  <p className="mb-2 text-sm font-medium">{opt.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((v) => (
                      <Button
                        key={v}
                        variant={selectedOptions[opt.name] === v ? "default" : "outline"}
                        size="sm"
                        className="rounded-none"
                        onClick={() => setSelectedOptions({ ...selectedOptions, [opt.name]: v })}
                      >
                        {v}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null
            )}

            <div className="pt-4">
              <Button
                size="lg"
                className="w-full rounded-none"
                disabled={!matchedVariant?.availableForSale || isLoading}
                onClick={handleAdd}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : !matchedVariant?.availableForSale ? (
                  "স্টকে নেই"
                ) : (
                  "কার্টে যোগ করুন"
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                ডিসক্রিট প্যাকেজিং • সিকিউর পেমেন্ট
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
