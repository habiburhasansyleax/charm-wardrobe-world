import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 font-serif text-3xl">কার্ট দেখতে লগইন করুন</h1>
          <Button className="mt-6 rounded-none" onClick={() => navigate("/auth")}>লগইন</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <h1 className="mb-10 text-center font-serif text-4xl font-light">আপনার কার্ট</h1>

        {items.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">আপনার কার্ট এখনো খালি</p>
            <Button className="mt-6 rounded-none" onClick={() => navigate("/shop")}>শপিং শুরু করুন</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border/40 pb-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-muted">
                    {item.product.image_url && (
                      <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.size && `সাইজ: ${item.size}`} {item.color && `• রঙ: ${item.color}`}
                      </p>
                      <p className="text-sm text-primary">৳ {Number(item.product.price).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-muted">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-4 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-muted">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit space-y-4 border border-border bg-secondary/30 p-6">
              <h2 className="font-serif text-xl">অর্ডার সারাংশ</h2>
              <div className="flex justify-between text-sm">
                <span>সাবটোটাল</span>
                <span>৳ {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>ডেলিভারি</span>
                <span>চেকআউটে গণনা</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4 font-medium">
                <span>মোট</span>
                <span>৳ {total.toLocaleString()}</span>
              </div>
              <Button className="w-full rounded-none" size="lg" onClick={() => navigate("/checkout")}>
                চেকআউট করুন
              </Button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
