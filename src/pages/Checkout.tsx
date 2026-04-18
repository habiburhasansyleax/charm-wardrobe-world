import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ phone: "", address: "", notes: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;
    setSubmitting(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: total,
        delivery_address: form.address,
        phone: form.phone,
        notes: form.notes || null,
      })
      .select()
      .single();

    if (error || !order) {
      toast.error("অর্ডার তৈরি করতে সমস্যা হয়েছে");
      setSubmitting(false);
      return;
    }

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
      size: i.size,
      color: i.color,
    }));

    await supabase.from("order_items").insert(orderItems);
    await clearCart();
    toast.success("অর্ডার সফল হয়েছে!");
    navigate("/orders");
  };

  if (!user || items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p>চেকআউট করতে কার্টে পণ্য থাকতে হবে</p>
          <Button className="mt-4 rounded-none" onClick={() => navigate("/shop")}>শপিং করুন</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-10 text-center font-serif text-4xl font-light">চেকআউট</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="phone">ফোন নম্বর *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-none"
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <Label htmlFor="address">ডেলিভারি ঠিকানা *</Label>
            <Textarea
              id="address"
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="rounded-none"
              placeholder="বাসা, রোড, এলাকা, শহর"
            />
          </div>
          <div>
            <Label htmlFor="notes">অতিরিক্ত নোট (ঐচ্ছিক)</Label>
            <Textarea
              id="notes"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="rounded-none"
            />
          </div>

          <div className="border border-border bg-secondary/30 p-6">
            <div className="flex justify-between font-medium">
              <span>মোট পরিশোধ্য</span>
              <span>৳ {total.toLocaleString()}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              পেমেন্ট পদ্ধতি: ক্যাশ অন ডেলিভারি
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-none" disabled={submitting}>
            {submitting ? "প্রক্রিয়া হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
          </Button>
        </form>
      </section>
    </Layout>
  );
};

export default Checkout;
