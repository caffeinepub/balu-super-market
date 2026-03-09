import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertCircle,
  Clock,
  Facebook,
  Instagram,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AddProductForm } from "./components/AddProductForm";
import { CategoryNav } from "./components/CategoryNav";
import { ProductCard } from "./components/ProductCard";
import { ProductGridSkeleton } from "./components/ProductSkeleton";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useInit, useProducts } from "./hooks/useQueries";

const STORE_INFO = {
  name: "BALU SUPER MARKET",
  tagline: "Fresh · Quality · Affordable",
  tamilName: "பாலு சூப்பர் மார்க்கெட்",
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

const STAFF_PASSWORD = "balu2024";

const ANNOUNCEMENTS = [
  "🎉 Grand Sale — Up to 30% OFF on all Fresh Fruits!",
  "🥤 Fresh Juices available daily from 7 AM",
  "🛒 Buy 2 Get 1 FREE on selected Grocery items",
  "🔥 Hot snacks ready every morning from 8 AM",
  "❄️ Ice creams & cold drinks — Beat the heat!",
  "📞 Home delivery available — Call +91 95859 84638",
  "⭐ Trusted by thousands of families since 2005",
  "🌿 100% Fresh produce, direct from farms",
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [adminMode, setAdminMode] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { clear } = useInternetIdentity();
  useActor();

  useInit();

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();

  const canAccessAdmin = passwordVerified;

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let list = products;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    if (!products) return {};
    const counts: Record<string, number> = { All: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  // Featured products: first 4 from each of Hot & Fresh Juice
  const featuredProducts = useMemo(() => {
    if (!products) return [];
    const hot = products.filter((p) => p.category === "Hot Items").slice(0, 2);
    const juice = products
      .filter((p) => p.category === "Fresh Juice")
      .slice(0, 2);
    const fruits = products
      .filter((p) => p.category === "Fresh Fruits")
      .slice(0, 2);
    return [...hot, ...juice, ...fruits].slice(0, 4);
  }, [products]);

  function handlePasswordSubmit() {
    if (passwordInput !== STAFF_PASSWORD) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
    setPasswordVerified(true);
    setAdminMode(true);
    setShowLoginDialog(false);
    setPasswordInput("");
    toast.success("Logged in as staff! Admin Panel is now active.");
  }

  function handleLogout() {
    clear();
    setPasswordVerified(false);
    setAdminMode(false);
    toast.success("Logged out successfully");
  }

  const announcementText = ANNOUNCEMENTS.concat(ANNOUNCEMENTS);

  return (
    <div className="min-h-screen bg-background market-texture font-body">
      <Toaster richColors position="top-right" />

      {/* ─── ANNOUNCEMENT BAR ─── */}
      <div className="market-gradient-announce text-white text-xs font-semibold overflow-hidden py-2">
        <div className="marquee-track">
          {announcementText.map((text, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static announcement list
            <span key={i} className="flex items-center gap-6 shrink-0">
              {text}
              <span className="opacity-40 text-base">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── TOP NAV BAR ─── */}
      <div className="bg-white border-b border-border/60 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[oklch(0.40_0.14_152)] flex items-center justify-center shadow-md">
              <span className="text-lg leading-none">🛒</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-black text-sm text-[oklch(0.20_0.10_152)] leading-none">
                BALU SUPER MARKET
              </p>
              <p className="text-[0.65rem] text-[oklch(0.50_0.03_65)] leading-none mt-0.5">
                {STORE_INFO.tamilName}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.60_0.04_70)]" />
            <input
              type="search"
              placeholder="Search products, fruits, juice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-ocid="product.search_input"
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[oklch(0.90_0.018_78)] bg-[oklch(0.975_0.012_80)] text-sm font-medium placeholder:text-[oklch(0.65_0.03_70)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.40_0.14_152/0.3)] focus:border-[oklch(0.40_0.14_152/0.5)] transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[oklch(0.50_0.03_65)]">
              <Phone className="h-3.5 w-3.5 text-[oklch(0.40_0.14_152)]" />
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="hover:text-[oklch(0.40_0.14_152)] transition-colors font-semibold"
              >
                {STORE_INFO.phone}
              </a>
            </div>
            {canAccessAdmin ? (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdminMode((prev) => !prev)}
                  data-ocid="admin.toggle"
                  className={`border-[oklch(0.40_0.14_152/0.4)] text-[oklch(0.36_0.14_152)] hover:bg-[oklch(0.92_0.06_148)] gap-1.5 font-semibold text-xs h-8 ${
                    adminMode ? "bg-[oklch(0.92_0.06_148)]" : ""
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {adminMode ? "Exit Admin" : "Admin"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  data-ocid="admin.logout.button"
                  className="text-[oklch(0.50_0.03_65)] hover:text-[oklch(0.577_0.245_27)] gap-1.5 text-xs h-8"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPasswordInput("");
                  setPasswordError(false);
                  setShowLoginDialog(true);
                }}
                data-ocid="staff.login.button"
                className="border-[oklch(0.40_0.14_152/0.4)] text-[oklch(0.36_0.14_152)] hover:bg-[oklch(0.92_0.06_148)] gap-1.5 font-semibold text-xs h-8"
              >
                <LogIn className="h-3.5 w-3.5" />
                Staff Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <header className="market-gradient-hero text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-white/3 pointer-events-none" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5 text-xs font-bold tracking-wide uppercase"
            >
              <Star className="h-3 w-3 fill-[oklch(0.80_0.15_78)] text-[oklch(0.80_0.15_78)]" />
              Trusted by Families Since 2005
              <Star className="h-3 w-3 fill-[oklch(0.80_0.15_78)] text-[oklch(0.80_0.15_78)]" />
            </motion.div>

            {/* Store name */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight mb-2">
              BALU
              <br />
              <span className="text-[oklch(0.80_0.15_78)]">SUPER MARKET</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl font-medium mb-2 tracking-wide">
              {STORE_INFO.tamilName}
            </p>
            <p className="text-white/60 text-base sm:text-lg font-medium mb-8 tracking-widest uppercase">
              {STORE_INFO.tagline}
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 mb-8">
              {[
                { value: "90+", label: "Products" },
                { value: "5", label: "Categories" },
                { value: "Fresh", label: "Daily" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display font-black text-2xl sm:text-3xl text-[oklch(0.80_0.15_78)] leading-none">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-xs font-medium mt-0.5 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Store info pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-2 text-xs font-medium">
                <MapPin className="h-3.5 w-3.5 text-[oklch(0.80_0.15_78)] shrink-0" />
                <span className="text-white/85">
                  Asanur Main Road, Chettithangal - 608304
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-2 text-xs font-medium">
                <Clock className="h-3.5 w-3.5 text-[oklch(0.80_0.15_78)]" />
                <span className="text-white/85">7:00 AM – 9:00 PM</span>
              </div>
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 rounded-full px-3.5 py-2 text-xs font-medium transition-all"
              >
                <Phone className="h-3.5 w-3.5 text-[oklch(0.80_0.15_78)]" />
                <span className="text-white/85">{STORE_INFO.phone}</span>
              </a>
            </div>
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
                  — Edit prices, toggle stock, and manage products
                </span>
              </div>
              <AddProductForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DEALS BANNER ─── */}
      {!adminMode && (
        <div className="bg-gradient-to-r from-[oklch(0.55_0.22_25/0.08)] via-[oklch(0.80_0.15_78/0.10)] to-[oklch(0.55_0.22_25/0.08)] border-b border-[oklch(0.80_0.15_78/0.3)]">
          <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-4 sm:gap-6 min-w-max">
              <div className="flex items-center gap-2 text-sm font-bold text-[oklch(0.45_0.15_48)]">
                <Tag className="h-4 w-4" />
                <span>TODAY'S DEALS</span>
              </div>
              {[
                {
                  text: "🍎 Fruits up to 20% off",
                  color: "bg-red-100 text-red-700 border-red-200",
                },
                {
                  text: "🥤 Buy 2 Juices, Get 1 Free",
                  color: "bg-orange-100 text-orange-700 border-orange-200",
                },
                {
                  text: "🛒 Grocery combo offers",
                  color: "bg-green-100 text-green-700 border-green-200",
                },
              ].map((deal) => (
                <span
                  key={deal.text}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${deal.color} whitespace-nowrap`}
                >
                  {deal.text}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[oklch(0.50_0.03_65)] shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-[oklch(0.80_0.15_78)]" />
              <span className="font-medium hidden sm:inline">
                Limited time offers
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* ── Featured / Today's Picks ── */}
        {!searchQuery &&
          activeCategory === "All" &&
          featuredProducts.length > 0 &&
          !adminMode && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-black text-xl text-[oklch(0.15_0.05_50)] section-heading">
                    Today's Picks
                  </h2>
                  <p className="text-xs text-[oklch(0.50_0.03_65)] mt-1.5">
                    Fresh daily recommendations
                  </p>
                </div>
                <Badge className="bg-[oklch(0.40_0.14_152/0.1)] text-[oklch(0.36_0.14_152)] border-[oklch(0.40_0.14_152/0.3)] text-xs font-semibold hover:bg-[oklch(0.40_0.14_152/0.15)]">
                  ✨ Fresh Today
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={`featured-${product.id.toString()}`}
                    product={product}
                    isAdmin={false}
                    compact
                  />
                ))}
              </div>
            </motion.section>
          )}

        {/* Category Navigation */}
        <section className="mb-6">
          <CategoryNav
            active={activeCategory}
            onChange={(cat) => {
              setActiveCategory(cat);
              setSearchQuery("");
            }}
            counts={categoryCounts}
          />
        </section>

        {/* Error state */}
        {productsError && (
          <Alert
            variant="destructive"
            className="mb-6"
            data-ocid="products.error_state"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load products. Please refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Product grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-black text-xl text-[oklch(0.15_0.05_50)] section-heading">
                {searchQuery
                  ? `Search: "${searchQuery}"`
                  : activeCategory === "All"
                    ? "All Products"
                    : activeCategory}
              </h2>
              {!productsLoading && filteredProducts.length > 0 && (
                <p className="text-xs text-[oklch(0.50_0.03_65)] mt-1.5">
                  {filteredProducts.length} item
                  {filteredProducts.length !== 1 ? "s" : ""} available
                </p>
              )}
            </div>
            {adminMode && <AddProductForm />}
          </div>

          {productsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20" data-ocid="products.empty_state">
              <div className="text-6xl mb-4">{searchQuery ? "🔍" : "🛒"}</div>
              <h3 className="font-display text-lg font-bold text-[oklch(0.15_0.05_50)] mb-2">
                {searchQuery ? "No results found" : "No products found"}
              </h3>
              <p className="text-[oklch(0.50_0.03_65)] text-sm">
                {searchQuery
                  ? `No products match "${searchQuery}". Try a different search.`
                  : activeCategory === "All"
                    ? "Products are being loaded..."
                    : `No products in the "${activeCategory}" category yet.`}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.035 } },
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

      {/* ─── WHY CHOOSE US ─── */}
      {!adminMode && (
        <section className="bg-[oklch(0.40_0.14_152)] text-white py-12 mt-8">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display font-black text-2xl sm:text-3xl mb-2">
                Why Shop at Balu Super Market?
              </h2>
              <p className="text-white/70 text-sm">
                Your trusted neighbourhood grocery store
              </p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  icon: "🌿",
                  title: "Farm Fresh",
                  desc: "Direct from local farms, daily",
                },
                {
                  icon: "💰",
                  title: "Best Prices",
                  desc: "Unbeatable deals every day",
                },
                {
                  icon: "⭐",
                  title: "Quality",
                  desc: "Hand-picked premium products",
                },
                {
                  icon: "🏪",
                  title: "Wide Range",
                  desc: "90+ products in 5 categories",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-display font-bold text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/65 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── LOCATION & CONTACT ─── */}
      <section className="bg-white border-t border-[oklch(0.90_0.018_78)] mt-0">
        <div className="container mx-auto px-4 sm:px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[oklch(0.15_0.05_50)] mb-2">
                Find Us
              </h2>
              <p className="text-[oklch(0.50_0.03_65)] text-sm">
                Visit us at Asanur Main Road, Chettithangal
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-[oklch(0.90_0.018_78)] shadow-sm aspect-video md:aspect-auto md:h-80">
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
              <div className="flex flex-col gap-4">
                {/* Address */}
                <div className="flex gap-4 p-4 rounded-xl bg-[oklch(0.92_0.06_148)] border border-[oklch(0.40_0.14_152/0.15)]">
                  <div className="w-10 h-10 rounded-xl bg-[oklch(0.40_0.14_152)] flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-[oklch(0.15_0.05_50)] text-sm mb-1">
                      Store Address
                    </p>
                    <p className="text-[oklch(0.42_0.04_65)] text-sm leading-relaxed">
                      {STORE_INFO.address}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 p-4 rounded-xl bg-[oklch(0.95_0.05_72)] border border-[oklch(0.70_0.18_48/0.15)]">
                  <div className="w-10 h-10 rounded-xl bg-[oklch(0.70_0.18_48)] flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-[oklch(0.15_0.05_50)] text-sm mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${STORE_INFO.phone}`}
                      className="text-[oklch(0.36_0.14_152)] font-semibold hover:underline text-sm"
                    >
                      {STORE_INFO.phone}
                    </a>
                    <p className="text-[oklch(0.50_0.03_65)] text-xs mt-0.5">
                      Call us anytime during store hours
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 p-4 rounded-xl bg-[oklch(0.94_0.012_82)] border border-[oklch(0.90_0.018_78)]">
                  <div className="w-10 h-10 rounded-xl bg-[oklch(0.15_0.05_50)] flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-[oklch(0.15_0.05_50)] text-sm mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${STORE_INFO.email}`}
                      className="text-[oklch(0.36_0.14_152)] font-semibold hover:underline text-sm"
                    >
                      {STORE_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="p-4 rounded-xl bg-white border border-[oklch(0.90_0.018_78)]">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-[oklch(0.40_0.14_152)]" />
                    <p className="font-display font-bold text-[oklch(0.15_0.05_50)] text-sm">
                      Opening Hours
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[oklch(0.50_0.03_65)] text-sm">
                        Monday – Saturday
                      </span>
                      <span className="font-display font-bold text-[oklch(0.36_0.14_152)] text-sm">
                        7:00 AM – 9:00 PM
                      </span>
                    </div>
                    <Separator className="bg-[oklch(0.90_0.018_78)]" />
                    <div className="flex justify-between items-center">
                      <span className="text-[oklch(0.50_0.03_65)] text-sm">
                        Sunday
                      </span>
                      <span className="font-display font-bold text-[oklch(0.36_0.14_152)] text-sm">
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

      {/* ─── STAFF LOGIN DIALOG ─── */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-sm" data-ocid="staff.login.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold font-display">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.40_0.14_152)] flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              Staff Login
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="staff-password" className="font-semibold text-sm">
                Staff Password
              </Label>
              <Input
                id="staff-password"
                type="password"
                placeholder="Enter staff password"
                value={passwordInput}
                data-ocid="staff.login.input"
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePasswordSubmit();
                }}
                className={
                  passwordError
                    ? "border-red-400 focus-visible:ring-red-400"
                    : "focus-visible:ring-[oklch(0.40_0.14_152/0.4)]"
                }
                autoFocus
              />
              {passwordError && (
                <p
                  className="text-sm text-red-500 flex items-center gap-1.5"
                  data-ocid="staff.login.error_state"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Incorrect password. Please try again.
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="staff.login.cancel_button"
              onClick={() => {
                setShowLoginDialog(false);
                setPasswordInput("");
                setPasswordError(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              disabled={!passwordInput}
              data-ocid="staff.login.submit_button"
              className="bg-[oklch(0.40_0.14_152)] hover:bg-[oklch(0.36_0.14_152)] text-white font-semibold"
            >
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[oklch(0.12_0.04_52)] text-white">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[oklch(0.40_0.14_152)] flex items-center justify-center">
                  <span className="text-lg">🛒</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-white leading-none">
                    BALU SUPER MARKET
                  </h3>
                  <p className="text-white/50 text-[0.65rem] leading-none mt-0.5">
                    {STORE_INFO.tamilName}
                  </p>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">
                Your trusted neighbourhood grocery store in Chettithangal. Fresh
                produce, quality products, and the best prices.
              </p>
            </div>

            {/* Quick info */}
            <div>
              <h4 className="font-display font-bold text-sm text-white/90 mb-3">
                Contact
              </h4>
              <div className="space-y-2.5 text-xs text-white/60">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[oklch(0.80_0.15_78)] mt-0.5 shrink-0" />
                  <span>{STORE_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[oklch(0.80_0.15_78)] shrink-0" />
                  <a
                    href={`tel:${STORE_INFO.phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {STORE_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[oklch(0.80_0.15_78)] shrink-0" />
                  <a
                    href={`mailto:${STORE_INFO.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {STORE_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours & Social */}
            <div>
              <h4 className="font-display font-bold text-sm text-white/90 mb-3">
                Hours & Follow Us
              </h4>
              <div className="space-y-1.5 text-xs text-white/60 mb-4">
                <div className="flex justify-between">
                  <span>Mon – Sat</span>
                  <span className="font-semibold text-white/80">
                    7:00 AM – 9:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-white/80">
                    8:00 AM – 7:00 PM
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[oklch(0.40_0.14_152)] flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[oklch(0.70_0.18_48)] flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10 mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>
              © {new Date().getFullYear()} Balu Super Market. All rights
              reserved.
            </p>
            <p>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/70 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
