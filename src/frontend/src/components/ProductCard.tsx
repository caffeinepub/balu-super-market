import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Check,
  ImageIcon,
  Loader2,
  Pencil,
  ShoppingBag,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import {
  useToggleProductAvailability,
  useUpdateProductPrice,
} from "../hooks/useQueries";
import { getProductImage, setProductImage } from "../utils/productImages";

const CATEGORY_ICONS: Record<string, string> = {
  Grocery: "🛒",
  "Fresh Fruits": "🍎",
  "Fresh Juice": "🥤",
  "Hot Items": "🔥",
  "Cold Items": "❄️",
};

const PRODUCT_IMAGES: Record<string, string> = {
  // ── Grocery ──────────────────────────────────────────────────────────────
  Rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  "Wheat Flour":
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
  Sugar: "https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=400&q=80",
  Salt: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80",
  "Cooking Oil":
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "Toor Dal":
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&q=80",
  "Turmeric Powder":
    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  "Red Chilli Powder":
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80",
  "Mustard Seeds":
    "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400&q=80",
  "Basmati Rice":
    "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80",
  Milk: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  Eggs: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
  Butter:
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
  Honey:
    "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80",
  Noodles:
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  Chips:
    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",
  Jam: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80",
  Cheese:
    "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&q=80",
  Pasta: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "Tomato Sauce":
    "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80",

  // ── Fresh Fruits ─────────────────────────────────────────────────────────
  Apple:
    "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80",
  Banana:
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
  Mango:
    "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",
  Orange:
    "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80",
  Grapes:
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80",
  Watermelon:
    "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80",
  Papaya:
    "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&q=80",
  Pomegranate:
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
  Guava:
    "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&q=80",
  Pineapple:
    "https://images.unsplash.com/photo-1587883012610-e3df17d41270?w=400&q=80",
  Coconut:
    "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=400&q=80",
  Strawberry:
    "https://images.unsplash.com/photo-1543528176-61b239494933?w=400&q=80",
  Kiwi: "https://images.unsplash.com/photo-1618897996318-5a901fa696ca?w=400&q=80",

  // ── Fresh Juice ──────────────────────────────────────────────────────────
  "Orange Juice":
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80",
  "Mango Juice":
    "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80",
  "Apple Juice":
    "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=400&q=80",
  "Lemon Juice":
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  "Mixed Fruit Juice":
    "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80",
  "Sugarcane Juice":
    "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80",
  "Pineapple Juice":
    "https://images.unsplash.com/photo-1587830399743-94c4a88bbee3?w=400&q=80",
  "Watermelon Juice":
    "https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=400&q=80",
  "Coconut Water":
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
  "Grape Juice":
    "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&q=80",

  // ── Hot Items ────────────────────────────────────────────────────────────
  Samosa:
    "https://images.unsplash.com/photo-1601050690117-94f5f7a2d2e4?w=400&q=80",
  Vada: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80",
  "Bread Roll":
    "https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=400&q=80",
  "Puff Pastry":
    "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80",
  Tea: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80",
  Coffee:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  Poha: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
  Upma: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
  Idli: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  Dosa: "https://images.unsplash.com/photo-1650884212930-f79df0a94b3a?w=400&q=80",
  "Masala Chai":
    "https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400&q=80",
  Bread:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  Biscuits:
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  "Pav Bhaji":
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",

  // ── Cold Items ───────────────────────────────────────────────────────────
  "Vanilla Ice Cream":
    "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&q=80",
  "Chocolate Ice Cream":
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
  "Mango Lassi":
    "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80",
  Buttermilk:
    "https://images.unsplash.com/photo-1628557010796-2aa3a4960a56?w=400&q=80",
  "Cold Coffee":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  "Coca Cola":
    "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
  Sprite:
    "https://images.unsplash.com/photo-1625174823475-d3f9e13de6b6?w=400&q=80",
  "Cold Water":
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
  "Mango Ice Cream":
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80",
  "Strawberry Ice Cream":
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80",
  Milkshake:
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  Yogurt:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
  "Fruit Salad":
    "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&q=80",
};

// Category-level fallback images when product-specific image is not found
const CATEGORY_IMAGES: Record<string, string> = {
  Grocery:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
  "Fresh Fruits":
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80",
  "Fresh Juice":
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
  "Hot Items":
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "Cold Items":
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80",
};

// Generate a dynamic Unsplash image URL using the product name as keyword
function getDynamicImageUrl(productName: string, category: string): string {
  const keyword = encodeURIComponent(productName.toLowerCase());
  const seed = productName.length + category.length;
  return `https://source.unsplash.com/400x300/?${keyword}&sig=${seed}`;
}

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
  const [imgError, setImgError] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [imageInputError, setImageInputError] = useState(false);

  const updatePrice = useUpdateProductPrice();
  const toggleAvailability = useToggleProductAvailability();

  const icon = CATEGORY_ICONS[product.category] ?? "📦";
  const colorClass =
    CATEGORY_COLORS[product.category] ??
    "bg-gray-100 text-gray-800 border-gray-200";

  const customImage = getProductImage(product.name);
  const imageUrl =
    customImage ??
    PRODUCT_IMAGES[product.name] ??
    CATEGORY_IMAGES[product.category] ??
    getDynamicImageUrl(product.name, product.category);

  function handleSaveImage() {
    const trimmed = imageInput.trim();
    if (!trimmed) {
      toast.error("Please enter a valid image URL");
      return;
    }
    setProductImage(product.name, trimmed);
    setImgError(false);
    setEditingImage(false);
    setImageInput("");
    toast.success("Product image updated");
  }

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
        {/* Product image section */}
        <div
          className={`relative w-full overflow-hidden ${
            product.category === "Fresh Fruits"
              ? "bg-gradient-to-br from-red-50 to-orange-100"
              : product.category === "Fresh Juice"
                ? "bg-gradient-to-br from-orange-50 to-yellow-100"
                : product.category === "Hot Items"
                  ? "bg-gradient-to-br from-rose-50 to-red-100"
                  : product.category === "Cold Items"
                    ? "bg-gradient-to-br from-blue-50 to-cyan-100"
                    : "bg-gradient-to-br from-green-50 to-emerald-100"
          }`}
        >
          {imageUrl && !imgError && (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-auto object-contain block"
              onError={() => setImgError(true)}
            />
          )}
          {/* Fallback icon when no image */}
          {(!imageUrl || imgError) && (
            <div className="w-full py-8 flex items-center justify-center">
              <span
                className="text-5xl"
                role="img"
                aria-label={product.category}
              >
                {icon}
              </span>
            </div>
          )}

          {/* Subtle overlay for unavailable items */}
          {!product.available && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Admin: change image button */}
          {isAdmin && !editingImage && (
            <button
              type="button"
              onClick={() => {
                setImageInput(imageUrl ?? "");
                setImageInputError(false);
                setEditingImage(true);
              }}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Change image"
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Image edit overlay */}
          {isAdmin && editingImage && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 p-3">
              <p className="text-white text-xs font-semibold">
                Paste Image URL
              </p>
              <input
                type="url"
                placeholder="https://..."
                value={imageInput}
                onChange={(e) => {
                  setImageInput(e.target.value);
                  setImageInputError(false);
                }}
                className="w-full text-xs px-2 py-1.5 rounded border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-white/70"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveImage();
                  if (e.key === "Escape") setEditingImage(false);
                }}
              />
              {imageInputError && (
                <p className="text-red-400 text-xs">Invalid URL</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveImage}
                  className="bg-market-green hover:bg-market-green/90 text-white text-xs px-3 py-1 rounded font-semibold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingImage(false)}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

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
          {/* Header row: category + availability */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
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
