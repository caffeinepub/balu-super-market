import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Pencil, ShoppingBag, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import {
  useToggleProductAvailability,
  useUpdateProductPrice,
} from "../hooks/useQueries";

const CATEGORY_ICONS: Record<string, string> = {
  Grocery: "🛒",
  "Fresh Fruits": "🍎",
  "Fresh Juice": "🥤",
  "Hot Items": "🔥",
  "Cold Items": "❄️",
};

const CATEGORY_COLORS: Record<string, string> = {
  Grocery: "bg-amber-100 text-amber-800 border-amber-200",
  "Fresh Fruits": "bg-red-100 text-red-800 border-red-200",
  "Fresh Juice": "bg-orange-100 text-orange-800 border-orange-200",
  "Hot Items": "bg-rose-100 text-rose-800 border-rose-200",
  "Cold Items": "bg-blue-100 text-blue-800 border-blue-200",
};

function formatPrice(price: bigint): string {
  const num = Number(price);
  return `₹${num.toLocaleString("en-IN")}`;
}

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
}

export function ProductCard({ product, isAdmin }: ProductCardProps) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState(
    Number(product.price).toString(),
  );

  const updatePrice = useUpdateProductPrice();
  const toggleAvailability = useToggleProductAvailability();

  const icon = CATEGORY_ICONS[product.category] ?? "📦";
  const colorClass =
    CATEGORY_COLORS[product.category] ??
    "bg-gray-100 text-gray-800 border-gray-200";

  function handleSavePrice() {
    const parsed = Number.parseInt(priceInput, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    updatePrice.mutate(
      { id: product.id, newPrice: BigInt(parsed) },
      {
        onSuccess: () => {
          toast.success(`Price updated to ₹${parsed.toLocaleString("en-IN")}`);
          setEditingPrice(false);
        },
        onError: () => {
          toast.error("Failed to update price. Please try again.");
        },
      },
    );
  }

  function handleToggle() {
    toggleAvailability.mutate(product.id, {
      onSuccess: () => {
        toast.success(
          product.available ? "Marked as out of stock" : "Marked as available",
        );
      },
      onError: () => {
        toast.error("Failed to update availability");
      },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group ${!product.available ? "stock-unavailable" : ""}`}
    >
      <Card className="relative overflow-hidden border-border/60 shadow-xs hover:shadow-md transition-shadow duration-300 market-gradient-card h-full">
        {/* Top accent bar with category color */}
        <div
          className={`h-1.5 w-full ${
            product.category === "Fresh Fruits"
              ? "bg-gradient-to-r from-red-400 to-orange-400"
              : product.category === "Fresh Juice"
                ? "bg-gradient-to-r from-orange-400 to-yellow-400"
                : product.category === "Hot Items"
                  ? "bg-gradient-to-r from-rose-500 to-red-400"
                  : product.category === "Cold Items"
                    ? "bg-gradient-to-r from-blue-400 to-cyan-400"
                    : "bg-gradient-to-r from-green-500 to-emerald-400"
          }`}
        />

        <CardContent className="p-4 flex flex-col gap-3 h-full">
          {/* Header row: icon + category + availability */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl leading-none"
                role="img"
                aria-label={product.category}
              >
                {icon}
              </span>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${colorClass}`}
              >
                {product.category}
              </Badge>
            </div>
            {!product.available && (
              <Badge variant="destructive" className="text-xs shrink-0">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Product name */}
          <h3 className="font-display font-semibold text-[0.95rem] leading-tight text-foreground line-clamp-2 group-hover:text-market-green transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Price section */}
          <div className="mt-auto pt-2 border-t border-border/50">
            {isAdmin && editingPrice ? (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-market-green">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="pl-7 h-8 text-sm font-semibold"
                    min="0"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSavePrice();
                      if (e.key === "Escape") setEditingPrice(false);
                    }}
                  />
                </div>
                <Button
                  size="icon"
                  variant="default"
                  className="h-8 w-8 bg-market-green hover:bg-market-green/90 shrink-0"
                  onClick={handleSavePrice}
                  disabled={updatePrice.isPending}
                >
                  {updatePrice.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 shrink-0"
                  onClick={() => {
                    setEditingPrice(false);
                    setPriceInput(Number(product.price).toString());
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="price-badge text-lg">
                  {formatPrice(product.price)}
                </span>
                {isAdmin && (
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-market-green hover:bg-market-green-light"
                      onClick={() => {
                        setPriceInput(Number(product.price).toString());
                        setEditingPrice(true);
                      }}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-7 px-2 text-xs ${
                        product.available
                          ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                          : "text-green-700 hover:bg-green-50"
                      }`}
                      onClick={handleToggle}
                      disabled={toggleAvailability.isPending}
                    >
                      {toggleAvailability.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ShoppingBag className="h-3 w-3 mr-1" />
                      )}
                      {product.available ? "Stock Off" : "In Stock"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
