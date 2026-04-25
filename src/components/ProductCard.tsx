import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const node = product.node;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <div className="group block">
      <Link to={`/product/${node.handle}`}>
        <div className="aspect-square overflow-hidden rounded-sm bg-muted">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              loading="lazy"
              className="h-full w-full object-cover transition-smooth group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
        <div className="mt-4 space-y-1 text-center">
          {node.productType && (
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{node.productType}</p>
          )}
          <h3 className="font-serif text-lg text-foreground">{node.title}</h3>
          <p className="text-sm text-primary">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </Link>
      <div className="mt-3 text-center">
        <Button
          size="sm"
          variant="outline"
          className="rounded-none"
          onClick={handleAdd}
          disabled={isLoading || !variant?.availableForSale}
        >
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "কার্টে যোগ করুন"}
        </Button>
      </div>
    </div>
  );
};
