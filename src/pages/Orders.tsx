import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  delivery_address: string;
  phone: string;
  created_at: string;
  order_items: { id: string; product_name: string; quantity: number; price: number; size: string | null; color: string | null }[];
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as any);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p>আপনার অর্ডার দেখতে লগইন করুন</p>
          <Button className="mt-4 rounded-none" onClick={() => navigate("/auth")}>লগইন</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-10 text-center font-serif text-4xl font-light">আমার অর্ডার</h1>

        {loading ? (
          <p className="text-center text-muted-foreground">লোড হচ্ছে...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-muted-foreground">কোন অর্ডার নেই</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="border border-border bg-card p-6">
                <div className="mb-4 flex flex-wrap justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">অর্ডার #{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("bn-BD")}</p>
                  </div>
                  <span className="rounded-none bg-primary-soft px-3 py-1 text-xs uppercase tracking-wider text-primary">
                    {o.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {o.order_items?.map((it) => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span>{it.product_name} × {it.quantity} {it.size && `(${it.size})`}</span>
                      <span>৳ {(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-3 font-medium">
                  <span>মোট</span>
                  <span>৳ {Number(o.total_amount).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Orders;
