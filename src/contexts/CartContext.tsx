import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
};

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, size?: string, color?: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, product:products(id, name, price, image_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as any);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const addToCart = async (productId: string, size?: string, color?: string) => {
    if (!user) {
      toast.error("কার্টে যোগ করতে লগইন করুন");
      return;
    }
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity: 1,
      size: size || null,
      color: color || null,
    });
    if (error) {
      toast.error("সমস্যা হয়েছে");
      return;
    }
    toast.success("কার্টে যোগ হয়েছে");
    refresh();
  };

  const removeFromCart = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    refresh();
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", id);
    refresh();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    refresh();
  };

  const total = items.reduce((s, i) => s + i.quantity * Number(i.product.price), 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, refresh, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
