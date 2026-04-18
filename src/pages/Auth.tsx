import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: form.fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("সাইনআপ সফল!");
    navigate("/");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("স্বাগতম!");
    navigate("/");
  };

  return (
    <Layout>
      <section className="container mx-auto max-w-md px-4 py-16">
        <h1 className="mb-8 text-center font-serif text-3xl font-light">আপনার অ্যাকাউন্ট</h1>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="signin" className="rounded-none">লগইন</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-none">সাইনআপ</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4 pt-6">
              <div>
                <Label>ইমেইল</Label>
                <Input type="email" required className="rounded-none" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>পাসওয়ার্ড</Label>
                <Input type="password" required className="rounded-none" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <Button type="submit" className="w-full rounded-none" disabled={loading}>
                {loading ? "অপেক্ষা করুন..." : "লগইন"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 pt-6">
              <div>
                <Label>পূর্ণ নাম</Label>
                <Input required className="rounded-none" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div>
                <Label>ইমেইল</Label>
                <Input type="email" required className="rounded-none" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</Label>
                <Input type="password" required minLength={6} className="rounded-none" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <Button type="submit" className="w-full rounded-none" disabled={loading}>
                {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default Auth;
