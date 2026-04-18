import { Link } from "react-router-dom";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
};

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
    >
      <div className="aspect-square overflow-hidden rounded-sm bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </div>
      <div className="mt-4 space-y-1 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.category}</p>
        <h3 className="font-serif text-lg text-foreground">{product.name}</h3>
        <p className="text-sm text-primary">৳ {Number(product.price).toLocaleString()}</p>
        {product.stock === 0 && (
          <p className="text-xs text-destructive">স্টকে নেই</p>
        )}
      </div>
    </Link>
  );
};
