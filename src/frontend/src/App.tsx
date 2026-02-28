import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertCircle,
  ChevronDown,
  Clock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AddProductForm } from "./components/AddProductForm";
import { CategoryNav } from "./components/CategoryNav";
import { ProductCard } from "./components/ProductCard";
import { ProductGridSkeleton } from "./components/ProductSkeleton";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useInit, useIsAdmin, useProducts } from "./hooks/useQueries";

const STORE_INFO = {
  name: "BALU SUPER MARKET",
  tagline: "Fresh, Quality & Affordable Groceries",
  address: "Asanur Main Road, Chettithangal - 608304, Tamil Nadu, India",
  phone: "+91 95859 84638",
  email: "balusupermarket@gmail.com",
  hours: {
    weekday: "Mon–Sat: 7:00 AM – 9:00 PM",
    weekend: "Sun: 8:00 AM – 7:00 PM",
  },
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15663.0!2d79.6!3d11.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDI0JzAwLjAiTiA3OcKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1700000000000",
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [adminMode, setAdminMode] = useState(false);

  const { login, clear, isLoggingIn, identity, isInitializing } =
    useInternetIdentity();
  const { isFetching: actorFetching } = useActor();

  // Initialize backend
  useInit();

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const { data: isAdmin } = useIsAdmin();

  // Sync admin mode off if user is no longer admin
  useEffect(() => {
    if (!isAdmin) setAdminMode(false);
  }, [isAdmin]);

  const isLoggedIn = !!identity;

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const categoryCounts = useMemo(() => {
    if (!products) return {};
    const counts: Record<string, number> = { All: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  function handleAdminToggle() {
    if (!isLoggedIn) {
      toast.info("Please log in first to access admin panel");
      return;
    }
    if (!isAdmin) {
      toast.error("You don't have admin privileges");
      return;
    }
    setAdminMode((prev) => !prev);
  }

  const isActorLoading = actorFetching || isInitializing;

  return (
    <div className="min-h-screen bg-background market-texture font-body">
      <Toaster richColors position="top-right" />

      {/* ─── HEADER ─── */}
      <header className="market-gradient-hero text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-8 left-1/3 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Top bar: Login/Admin */}
          <div className="flex justify-end gap-3 mb-6">
            {isActorLoading ? (
              <div className="h-9 w-28 rounded-full bg-white/20 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminToggle}
                    className={`border-white/30 text-white hover:bg-white/10 gap-1.5 font-semibold ${
                      adminMode ? "bg-white/20" : "bg-transparent"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {adminMode ? "Exit Admin" : "Admin Panel"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clear();
                    toast.success("Logged out successfully");
                  }}
                  className="border-white/30 text-white hover:bg-white/10 gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="border-white/30 text-white hover:bg-white/10 gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                {isLoggingIn ? "Logging in..." : "Staff Login"}
              </Button>
            )}
          </div>

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Store badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold">
              <Star className="h-3.5 w-3.5 fill-market-gold text-market-gold" />
              <span>Trusted Since 2005</span>
              <Star className="h-3.5 w-3.5 fill-market-gold text-market-gold" />
            </div>

            {/* Store name */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-3">
              🛒 BALU
              <br />
              <span className="text-market-gold">SUPER MARKET</span>
            </h1>

            <p className="text-white/85 text-lg sm:text-xl font-medium mb-6">
              {STORE_INFO.tagline}
            </p>

            {/* Store info pills */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <MapPin className="h-4 w-4 text-market-gold shrink-0" />
                <span className="text-white/90">{STORE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                  <Phone className="h-4 w-4 text-market-gold" />
                  <a
                    href={`tel:${STORE_INFO.phone}`}
                    className="text-white/90 hover:text-white"
                  >
                    {STORE_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                  <Clock className="h-4 w-4 text-market-gold" />
                  <span className="text-white/90">
                    {STORE_INFO.hours.weekday}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="flex justify-center mt-8"
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="h-6 w-6 text-white/50" />
          </motion.div>
        </div>
      </header>

      {/* ─── ADMIN PANEL BANNER ─── */}
      <AnimatePresence>
        {adminMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-50 border-b border-amber-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-amber-800">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-semibold text-sm">Admin Mode Active</span>
                <span className="text-xs text-amber-600 hidden sm:inline">
                  — You can edit prices, toggle availability, and add products
                </span>
              </div>
              <AddProductForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─── */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Category Navigation */}
        <section className="mb-6">
          <CategoryNav
            active={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />
        </section>

        {/* Error state */}
        {productsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load products. Please refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Product grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              {activeCategory === "All" ? "All Products" : activeCategory}
              {!productsLoading && filteredProducts.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredProducts.length} items)
                </span>
              )}
            </h2>
          </div>

          {productsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground text-sm">
                {activeCategory === "All"
                  ? "Products are being loaded..."
                  : `No products in the "${activeCategory}" category yet.`}
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.04 } },
                hidden: {},
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  isAdmin={adminMode}
                />
              ))}
            </motion.div>
          )}
        </section>
      </main>

      {/* ─── LOCATION & CONTACT ─── */}
      <section className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
              📍 Find Us
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Visit us at our store in Gandhi Nagar, Coimbatore
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border shadow-xs aspect-video md:aspect-auto md:h-72">
                <iframe
                  src={STORE_INFO.mapEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Balu Super Market Location"
                  className="w-full h-full"
                />
              </div>

              {/* Contact details */}
              <div className="flex flex-col gap-5">
                {/* Address */}
                <div className="flex gap-4 p-4 rounded-xl bg-market-green-light border border-market-green/20">
                  <div className="w-10 h-10 rounded-full bg-market-green flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      Store Address
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {STORE_INFO.address}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 p-4 rounded-xl bg-market-orange-light border border-market-orange/20">
                  <div className="w-10 h-10 rounded-full bg-market-orange flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${STORE_INFO.phone}`}
                      className="text-market-green font-medium hover:underline"
                    >
                      {STORE_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 p-4 rounded-xl bg-muted border border-border">
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${STORE_INFO.email}`}
                      className="text-market-green font-medium hover:underline text-sm"
                    >
                      {STORE_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-market-green" />
                    <p className="font-semibold text-foreground text-sm">
                      Opening Hours
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">
                        Monday – Saturday
                      </span>
                      <span className="text-foreground text-sm font-semibold">
                        7:00 AM – 9:00 PM
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">
                        Sunday
                      </span>
                      <span className="text-foreground text-sm font-semibold">
                        8:00 AM – 7:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-display font-black text-xl text-background/95 mb-1">
                🛒 BALU SUPER MARKET
              </h3>
              <p className="text-background/60 text-sm">{STORE_INFO.address}</p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1">
              <div className="flex items-center gap-3 text-sm text-background/60">
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="hover:text-background transition-colors"
                >
                  {STORE_INFO.phone}
                </a>
                <span>·</span>
                <a
                  href={`mailto:${STORE_INFO.email}`}
                  className="hover:text-background transition-colors"
                >
                  {STORE_INFO.email}
                </a>
              </div>
              <p className="text-background/40 text-xs">
                © {new Date().getFullYear()}. Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-background/70 transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
