import { ArrowRight, ArrowUpRight, BadgeCheck, Box, Cpu, Headphones, MemoryStick, MonitorCog, Mouse, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { useProducts, useToast } from "../context/StoreContext";
import { functions } from "../firebase/client";
import ProductGrid from "../components/ProductGrid";
import ProductImage from "../components/ProductImage";
import { formatPrice } from "../utils/format";

const categoryData = [
  { name: "Processors", icon: Cpu, caption: "The brain of your build" },
  { name: "Graphics Cards", icon: MonitorCog, caption: "Frames without limits" },
  { name: "Memory", icon: MemoryStick, caption: "More room to move" },
  { name: "Storage", icon: Box, caption: "Space for every idea" },
  { name: "Peripherals", icon: Mouse, caption: "Your setup, your feel" },
  { name: "Cooling", icon: Headphones, caption: "Keep it running cool" },
];

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const bestSellers = [...products]
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 4);

  const subscribe = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Enter a valid email address.", "error");
      return;
    }
    try {
      await httpsCallable(functions, "subscribeNewsletter")({ email });
      toast("You're subscribed to NEXUS PC build notes.");
      setEmail("");
    } catch (issue) {
      toast(issue.message || "Could not save your sign-up. Please try again.", "error");
    }
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-background" />
        <div className="hero-grid-pattern" />
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="pulse-dot" /> COMPONENTS FOR WHAT'S NEXT</div>
            <h1>Build your<br /><span>ultimate setup.</span></h1>
            <p>Thoughtful parts. Trusted brands. Everything you need to bring your next big idea to life.</p>
            <div className="hero-actions">
              <Link to="/shop" className="button button-primary">Explore the shop <ArrowRight size={17} /></Link>
              <a href="#categories" className="button button-ghost">Find your parts</a>
            </div>
            <div className="hero-proof"><span><BadgeCheck size={16} /> Curated components</span><span><Truck size={16} /> Ships across PH</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="hero-image-wrap"><img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=90" alt="Custom gaming PC with illuminated components" /></div>
            <div className="hero-float hero-float-top"><span className="float-icon"><Zap size={17} fill="currentColor" /></span><span><b>Built for performance</b><small>Every component counts</small></span></div>
            <div className="hero-float hero-float-bottom"><span className="float-icon"><Cpu size={18} /></span><span><b>Start with a plan</b><small>Parts for every kind of build</small></span></div>
            <div className="hero-index">Nº 01 <span>— YOUR NEXT BUILD</span></div>
          </div>
        </div>
        <div className="container hero-bottom"><span>THE COMPONENTS THAT MOVE YOU</span><span>01 — 06</span></div>
      </section>

      <section className="section container" id="categories">
        <div className="section-heading">
          <div><span className="eyebrow">START BUILDING</span><h2>Shop by category</h2><p>Start with what matters most to your build.</p></div>
          <Link className="text-link" to="/shop">All components <ArrowUpRight size={16} /></Link>
        </div>
        <div className="category-grid">
          {categoryData.map(({ name, icon: Icon, caption }, index) => (
            <Link to={`/shop?category=${encodeURIComponent(name)}`} key={name} className={`category-tile category-tone-${index}`}>
              <div className="category-icon"><Icon size={22} /></div><div><h3>{name}</h3><span>{caption}</span></div><ArrowUpRight size={17} className="category-arrow" />
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>Featured components</h2><p>Standout parts for a setup that feels like yours.</p></div>
            <Link className="text-link" to="/shop?featured=true">Shop featured <ArrowUpRight size={16} /></Link>
          </div>
          <ProductGrid products={featured} loading={loading} error={error} emptyTitle="No featured products yet" emptyMessage="Featured items will appear here as soon as the catalog is ready." />
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div><span className="eyebrow">BUILDERS' PICKS</span><h2>Best sellers</h2><p>Customer favorites from the NEXUS PC catalog.</p></div>
          <Link className="text-link" to="/shop">See everything <ArrowUpRight size={16} /></Link>
        </div>
        <ProductGrid products={bestSellers} loading={loading} error={error} compact emptyTitle="No products to feature yet" emptyMessage="Best sellers will appear after the catalog is seeded and orders start coming in." />
      </section>

      <section className="container promo-banner">
        <div className="promo-art"><img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=85" alt="" /></div>
        <div className="promo-copy">
          <span className="eyebrow"><Sparkles size={14} /> THE SMART BUILD SERIES</span>
          <h2>Big ideas.<br /><span>Better builds.</span></h2>
          <p>Explore components picked for balance, reliability, and the next upgrade on your list.</p>
          <Link to="/shop" className="button button-primary">Build your setup <ArrowRight size={17} /></Link>
          <small>All listed prices are sample data and are not verified live retailer offers.</small>
        </div>
        <div className="promo-mark">NEXUS / 2026</div>
      </section>

      <section className="section section-muted">
        <div className="container why-grid">
          <div className="why-intro"><span className="eyebrow">THE NEXUS DIFFERENCE</span><h2>Good gear.<br /><span>Better builds.</span></h2><p>Shopping for PC parts should feel exciting, not overwhelming. We're here to make the details easier.</p><Link className="text-link" to="/shop">Find your next upgrade <ArrowRight size={16} /></Link></div>
          <div className="why-card"><div className="why-number">01</div><ShieldCheck size={23} /><h3>Components that make sense</h3><p>Clear specs and useful details make it easier to plan a balanced setup.</p></div>
          <div className="why-card"><div className="why-number">02</div><Truck size={23} /><h3>Ready for your doorstep</h3><p>Checkout with delivery details for shipping anywhere in the Philippines.</p></div>
          <div className="why-card"><div className="why-number">03</div><Zap size={23} /><h3>Your build, your rules</h3><p>From the first part to the final upgrade, choose what works for you.</p></div>
        </div>
      </section>

      <section className="newsletter-section container" id="newsletter">
        <div className="newsletter-icon"><MailIcon /></div>
        <div className="newsletter-copy"><span className="eyebrow">THE BUILD LETTER</span><h2>Good gear in your inbox.</h2><p>New arrivals, setup inspiration, and build notes from NEXUS PC.</p></div>
        <form className="newsletter-form" onSubmit={subscribe}><input type="email" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} aria-label="Email address" required /><button className="button button-primary">Join the list <ArrowRight size={16} /></button><small>Your sign-up is saved securely, but email campaigns are not configured.</small></form>
      </section>
    </>
  );
}

function MailIcon() {
  return <div className="newsletter-icon-inner"><span>✦</span></div>;
}
