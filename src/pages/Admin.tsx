import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Pencil, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  image_url: string | null;
  is_active: boolean;
};

const empty = { name: "", description: "", price: "", category: "", sizes: "", colors: "", stock: "", image_url: "" };

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, authLoading, navigate]);

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      category: p.category,
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
      stock: String(p.stock),
      image_url: p.image_url || "",
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      category: form.category,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      stock: parseInt(form.stock || "0"),
      image_url: form.image_url || null,
    };

    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "আপডেট হয়েছে" : "যোগ হয়েছে");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast.success("মুছে ফেলা হয়েছে");
    load();
  };

  const toggleActive = async (p: Product) => {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    load();
  };

  if (authLoading) return <Layout><p className="container py-20 text-center">লোড হচ্ছে...</p></Layout>;

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-light">অ্যাডমিন প্যানেল</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="rounded-none">
                <Plus className="mr-2 h-4 w-4" /> নতুন পণ্য
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "পণ্য সম্পাদনা" : "নতুন পণ্য"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={save} className="space-y-3">
                <div><Label>নাম</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>বিবরণ</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>দাম (৳)</Label><Input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                  <div><Label>স্টক</Label><Input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
                </div>
                <div><Label>ক্যাটেগরি</Label><Input required placeholder="ব্রা / প্যান্টি / শেপওয়্যার..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                <div><Label>সাইজ (কমা দিয়ে)</Label><Input placeholder="S, M, L, XL" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} /></div>
                <div><Label>রঙ (কমা দিয়ে)</Label><Input placeholder="কালো, গোলাপি" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} /></div>
                <div><Label>ছবির URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
                <Button type="submit" className="w-full rounded-none">সংরক্ষণ</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3">পণ্য</th>
                <th className="p-3">ক্যাটেগরি</th>
                <th className="p-3">দাম</th>
                <th className="p-3">স্টক</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/40">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3">৳ {Number(p.price).toLocaleString()}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <button onClick={() => toggleActive(p)} className={`text-xs px-2 py-1 ${p.is_active ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.is_active ? "অ্যাক্টিভ" : "বন্ধ"}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">কোন পণ্য নেই</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
