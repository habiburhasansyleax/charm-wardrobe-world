import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Heart, Truck } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import heroImage from "@/assets/hero.jpg";

const Index = () => {
  const [featured, setFeatured] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    fetchProducts(4).then(setFeatured).catch(console.error);
  }, []);

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-center px-6 py-16 lg:px-16 gradient-soft">
            <div className="max-w-lg space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-primary">কোমলতা ও আত্মবিশ্বাস</p>
              <h1 className="font-serif text-5xl font-light leading-tight text-foreground md:text-6xl">
                নিজের জন্য<br />কিছু সুন্দর
              </h1>
              <p className="text-base text-muted-foreground">
                হাতে বাছাই করা প্রিমিয়াম মেয়েদের আন্ডারগার্মেন্টস। আরাম, মান ও মর্যাদা — সবই এক জায়গায়।
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-none">
                  <Link to="/shop">
                    শপ ব্রাউজ করুন <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-auto">
            <img
              src={heroImage}
              alt="Elegant lingerie collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border/40 bg-secondary/30 py-10">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
          {[
            { icon: Heart, title: "ডিসক্রিট প্যাকেজিং", desc: "আপনার গোপনীয়তা আমাদের অগ্রাধিকার" },
            { icon: Truck, title: "সারা দেশে ডেলিভারি", desc: "নিরাপদ ও দ্রুত শিপিং" },
            { icon: Sparkles, title: "প্রিমিয়াম কোয়ালিটি", desc: "সাবধানে বাছাই করা পণ্য" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="rounded-full bg-primary-soft p-3">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-serif text-lg">{b.title}</h4>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">কালেকশন</p>
          <h2 className="mt-2 font-serif text-4xl font-light">নতুন আগমন</h2>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {featured.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            এখনো কোনো পণ্য নেই — চ্যাটে আমাকে বলুন কী যোগ করতে চান।
          </p>
        )}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-none">
            <Link to="/shop">সব পণ্য দেখুন</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
