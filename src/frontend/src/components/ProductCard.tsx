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
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import {
  useRemoveProduct,
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
  "Basmati Rice (5 kg)":
    "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80",
  "Toor Dal (1 kg)":
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&q=80",
  "Sunflower Oil (1 L)":
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "Whole Wheat Atta (5 kg)":
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
  "Sugar (1 kg)":
    "https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=400&q=80",
  "Salt (1 kg)":
    "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80",
  "Chilli Powder (200g)":
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80",
  "Turmeric Powder (100g)":
    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  "Biscuits Marie (3 pack)":
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  "Bread (Large Loaf)":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Butter (500g)":
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
  "Eggs (12 pack)":
    "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
  "Moong Dal (500g)":
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "Chana Dal (1 kg)":
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
  "Urad Dal (500g)":
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
  "Mustard Seeds (100g)":
    "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400&q=80",
  "Cumin Seeds (100g)":
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
  "Coriander Powder (200g)":
    "https://images.unsplash.com/photo-1637073849667-49bcdf26c0f8?w=400&q=80",
  "Garam Masala (100g)":
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  "Coconut Oil (500ml)":
    "https://images.unsplash.com/photo-1616791151652-c9a2b7e6c0f3?w=400&q=80",
  "Ghee (500ml)":
    "https://images.unsplash.com/photo-1631452180775-9c9cdedf2394?w=400&q=80",
  "Honey (250g)":
    "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80",
  "Milk (1 L)":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  "Maggi Noodles (8 pack)":
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  "Tomato Ketchup (500g)":
    "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80",
  "Soya Sauce (200ml)":
    "https://images.unsplash.com/photo-1617731826-83a4fbab63b8?w=400&q=80",
  "Pasta (500g)":
    "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "Oats (500g)":
    "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=400&q=80",
  "Cornflakes (500g)":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "Green Tea (25 bags)":
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Almonds (250g)":
    "https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=400&q=80",
  "Cashews (250g)":
    "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=400&q=80",
  "Raisins (200g)":
    "https://images.unsplash.com/photo-1597733153203-a54d0fbc47de?w=400&q=80",
  "Groundnut Oil (1 L)":
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "Idli Rice (5 kg)":
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  "Vermicelli (200g)":
    "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80",
  "Poha (500g)":
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",

  // ── Fresh Fruits ─────────────────────────────────────────────────────────
  "Alphonso Mangoes (1 kg)":
    "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=80",
  "Bananas (1 dozen)":
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
  "Apples (1 kg)":
    "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80",
  "Grapes (500g)":
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80",
  "Watermelon (whole)":
    "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80",
  "Pomegranate (2 pcs)":
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
  "Papaya (1 pc)":
    "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&q=80",
  "Pineapple (1 pc)":
    "https://images.unsplash.com/photo-1587883012610-e3df17d41270?w=400&q=80",
  "Guava (500g)":
    "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&q=80",
  "Oranges (1 kg)":
    "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80",
  "Strawberries (250g)":
    "https://images.unsplash.com/photo-1543528176-61b239494933?w=400&q=80",
  "Kiwi (3 pcs)":
    "https://images.unsplash.com/photo-1618897996318-5a901fa696ca?w=400&q=80",
  "Chikoo (500g)":
    "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&q=80",
  "Coconut (1 pc)":
    "https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=400&q=80",
  "Lemon (6 pcs)":
    "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80",
  "Muskmelon (1 pc)":
    "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=400&q=80",
  "Dragon Fruit (1 pc)":
    "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&q=80",
  "Pear (1 kg)":
    "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&q=80",
  "Custard Apple (500g)":
    "https://images.unsplash.com/photo-1604495772376-9657f0621d46?w=400&q=80",
  "Plums (500g)":
    "https://images.unsplash.com/photo-1563746924237-f81d67e8f9c8?w=400&q=80",

  // ── Fresh Juice ──────────────────────────────────────────────────────────
  "Fresh Orange Juice (500ml)":
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80",
  "Sugarcane Juice (500ml)":
    "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80",
  "Mixed Fruit Juice (500ml)":
    "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80",
  "Coconut Water (1 pc)":
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
  "Lemon Ginger Juice (500ml)":
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  "Pineapple Juice (500ml)":
    "https://images.unsplash.com/photo-1587830399743-94c4a88bbee3?w=400&q=80",
  "Mango Juice (500ml)":
    "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80",
  "Watermelon Juice (500ml)":
    "https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=400&q=80",
  "Carrot Juice (300ml)":
    "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&q=80",
  "Pomegranate Juice (300ml)":
    "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&q=80",
  "Guava Juice (500ml)":
    "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&q=80",
  "Apple Juice (500ml)":
    "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=400&q=80",
  "Grape Juice (300ml)":
    "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&q=80",
  "Spinach Green Juice (300ml)":
    "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&q=80",
  "Papaya Juice (400ml)":
    "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&q=80",
  "Rose Milk (300ml)":
    "https://images.unsplash.com/photo-1599789197514-47270cd526b4?w=400&q=80",

  // ── Hot Items ────────────────────────────────────────────────────────────
  "Samosa (2 pcs)":
    "https://images.unsplash.com/photo-1601050690117-94f5f7a2d2e4?w=400&q=80",
  "Vada (2 pcs)":
    "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80",
  "Idli (4 pcs)":
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  "Pongal (1 plate)":
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
  "Mirchi Bhaji (3 pcs)":
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Filter Coffee (1 cup)":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  "Masala Dosa (1 pc)":
    "https://images.unsplash.com/photo-1650884212930-f79df0a94b3a?w=400&q=80",
  "Upma (1 plate)":
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
  "Puri Bhaji (2 pcs)":
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "Poha (1 plate)":
    "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80",
  "Chai (1 cup)":
    "https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400&q=80",
  "Pakora (6 pcs)":
    "https://images.unsplash.com/photo-1601050690117-94f5f7a2d2e4?w=400&q=80",
  "Bread Omelette":
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
  "Parotta (2 pcs)":
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "Aloo Paratha (2 pcs)":
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Veg Biryani (1 plate)":
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "Onion Uttapam (1 pc)":
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  "Rava Dosa (1 pc)":
    "https://images.unsplash.com/photo-1650884212930-f79df0a94b3a?w=400&q=80",
  "Chicken Roll (1 pc)":
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",

  // ── Cold Items ───────────────────────────────────────────────────────────
  "Ice Cream Vanilla (500ml)":
    "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&q=80",
  "Lassi (500ml)":
    "https://images.unsplash.com/photo-1628557010796-2aa3a4960a56?w=400&q=80",
  "Buttermilk (500ml)":
    "https://images.unsplash.com/photo-1628557010796-2aa3a4960a56?w=400&q=80",
  "Cold Drinks (300ml)":
    "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
  "Flavoured Milk (200ml)":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  "Frozen Peas (500g)":
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "Mango Ice Cream (500ml)":
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80",
  "Chocolate Ice Cream (500ml)":
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
  "Strawberry Ice Cream (500ml)":
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80",
  "Mango Lassi (300ml)":
    "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80",
  "Cold Coffee (300ml)":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
  "Chocolate Milkshake (300ml)":
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "Sprite (300ml)":
    "https://images.unsplash.com/photo-1625174823475-d3f9e13de6b6?w=400&q=80",
  "Tender Coconut Ice Cream":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Yogurt (200g)":
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
  "Fruit Salad Cup (1 pc)":
    "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&q=80",
  "Paneer Ice Cream Bar":
    "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400&q=80",
  "Lemon Soda (300ml)":
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  "Iced Tea (300ml)":
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Kulfi (2 pcs)":
    "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=400&q=80",
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

// Tamil names for all products
const PRODUCT_TAMIL_NAMES: Record<string, string> = {
  // Grocery
  Rice: "அரிசி",
  "Wheat Flour": "கோதுமை மாவு",
  Sugar: "சர்க்கரை",
  Salt: "உப்பு",
  "Cooking Oil": "சமையல் எண்ணெய்",
  "Toor Dal": "துவரம் பருப்பு",
  "Turmeric Powder": "மஞ்சள் தூள்",
  "Red Chilli Powder": "மிளகாய் தூள்",
  "Mustard Seeds": "கடுகு",
  "Basmati Rice": "பாஸ்மதி அரிசி",
  Milk: "பால்",
  Eggs: "முட்டை",
  Butter: "வெண்ணெய்",
  Honey: "தேன்",
  Noodles: "நூடுல்ஸ்",
  Chips: "சிப்ஸ்",
  Jam: "ஜாம்",
  "Basmati Rice (5 kg)": "பாஸ்மதி அரிசி (5 கி.கி)",
  "Toor Dal (1 kg)": "துவரம் பருப்பு (1 கி.கி)",
  "Sunflower Oil (1 L)": "சூரியகாந்தி எண்ணெய் (1 லி)",
  "Whole Wheat Atta (5 kg)": "கோதுமை மாவு (5 கி.கி)",
  "Sugar (1 kg)": "சர்க்கரை (1 கி.கி)",
  "Salt (1 kg)": "உப்பு (1 கி.கி)",
  "Chilli Powder (200g)": "மிளகாய் தூள் (200கி)",
  "Turmeric Powder (100g)": "மஞ்சள் தூள் (100கி)",
  "Biscuits Marie (3 pack)": "மேரி பிஸ்கட் (3 பேக்)",
  "Bread (Large Loaf)": "பிரட் (பெரியது)",
  "Butter (500g)": "வெண்ணெய் (500கி)",
  "Eggs (12 pack)": "முட்டை (12 பக்)",
  "Moong Dal (500g)": "பாசி பருப்பு (500கி)",
  "Chana Dal (1 kg)": "கடலை பருப்பு (1 கி.கி)",
  "Urad Dal (500g)": "உளுந்து (500கி)",
  "Mustard Seeds (100g)": "கடுகு (100கி)",
  "Cumin Seeds (100g)": "சீரகம் (100கி)",
  "Coriander Powder (200g)": "மல்லி தூள் (200கி)",
  "Garam Masala (100g)": "கரம் மசாலா (100கி)",
  "Coconut Oil (500ml)": "தேங்காய் எண்ணெய் (500மி.லி)",
  "Ghee (500ml)": "நெய் (500மி.லி)",
  "Honey (250g)": "தேன் (250கி)",
  "Milk (1 L)": "பால் (1 லி)",
  "Maggi Noodles (8 pack)": "மேகி நூடுல்ஸ் (8 பேக்)",
  "Tomato Ketchup (500g)": "தக்காளி கெட்சப் (500கி)",
  "Soya Sauce (200ml)": "சோயா சாஸ் (200மி.லி)",
  "Pasta (500g)": "பாஸ்தா (500கி)",
  "Oats (500g)": "ஓட்ஸ் (500கி)",
  "Cornflakes (500g)": "கார்ன்ஃப்ளேக்ஸ் (500கி)",
  "Green Tea (25 bags)": "பச்சை தேயிலை (25 பைகள்)",
  "Almonds (250g)": "பாதாம் (250கி)",
  "Cashews (250g)": "முந்திரி (250கி)",
  "Raisins (200g)": "திராட்சை (200கி)",
  "Groundnut Oil (1 L)": "நிலக்கடலை எண்ணெய் (1 லி)",
  "Idli Rice (5 kg)": "இட்லி அரிசி (5 கி.கி)",
  "Vermicelli (200g)": "சேவல் (200கி)",
  "Poha (500g)": "அவல் (500கி)",
  "Chicken Masala (100g)": "சிக்கன் மசாலா (100கி)",

  // Fresh Fruits
  Apple: "ஆப்பிள்",
  Banana: "வாழைப்பழம்",
  Mango: "மாம்பழம்",
  Orange: "ஆரஞ்சு",
  Grapes: "திராட்சை",
  Watermelon: "தர்பூசணி",
  Papaya: "பப்பாளி",
  Pomegranate: "மாதுளை",
  Guava: "கொய்யா",
  Pineapple: "அன்னாசி",
  Coconut: "தேங்காய்",
  Strawberry: "ஸ்ட்ராபெரி",
  Kiwi: "கிவி",
  "Alphonso Mangoes (1 kg)": "அல்ஃபான்சோ மாம்பழம் (1 கி.கி)",
  "Bananas (1 dozen)": "வாழைப்பழம் (1 டஜன்)",
  "Apples (1 kg)": "ஆப்பிள் (1 கி.கி)",
  "Grapes (500g)": "திராட்சை (500கி)",
  "Watermelon (whole)": "தர்பூசணி (முழுவதும்)",
  "Pomegranate (2 pcs)": "மாதுளை (2 எண்ணிக்கை)",
  "Papaya (1 pc)": "பப்பாளி (1 எண்ணிக்கை)",
  "Pineapple (1 pc)": "அன்னாசி (1 எண்ணிக்கை)",
  "Guava (500g)": "கொய்யா (500கி)",
  "Oranges (1 kg)": "ஆரஞ்சு (1 கி.கி)",
  "Strawberries (250g)": "ஸ்ட்ராபெரி (250கி)",
  "Kiwi (3 pcs)": "கிவி (3 எண்ணிக்கை)",
  "Chikoo (500g)": "சப்போட்டா (500கி)",
  "Coconut (1 pc)": "தேங்காய் (1 எண்ணிக்கை)",
  "Lemon (6 pcs)": "எலுமிச்சை (6 எண்ணிக்கை)",
  "Muskmelon (1 pc)": "முலாம்பழம் (1 எண்ணிக்கை)",
  "Dragon Fruit (1 pc)": "டிராகன் பழம் (1 எண்ணிக்கை)",
  "Pear (1 kg)": "பேரிக்காய் (1 கி.கி)",
  "Custard Apple (500g)": "சீத்தாப்பழம் (500கி)",
  "Plums (500g)": "அள்ளிக்காய் (500கி)",

  // Fresh Juice
  "Orange Juice": "ஆரஞ்சு ஜூஸ்",
  "Mango Juice": "மாம்பழ ஜூஸ்",
  "Apple Juice": "ஆப்பிள் ஜூஸ்",
  "Lemon Juice": "எலுமிச்சை ஜூஸ்",
  "Mixed Fruit Juice": "கலவை பழ ஜூஸ்",
  "Sugarcane Juice": "கரும்பு ஜூஸ்",
  "Pineapple Juice": "அன்னாசி ஜூஸ்",
  "Watermelon Juice": "தர்பூசணி ஜூஸ்",
  "Coconut Water": "இளநீர்",
  "Grape Juice": "திராட்சை ஜூஸ்",
  "Fresh Orange Juice (500ml)": "ஆரஞ்சு ஜூஸ் (500மி.லி)",
  "Sugarcane Juice (500ml)": "கரும்பு ஜூஸ் (500மி.லி)",
  "Mixed Fruit Juice (500ml)": "கலவை பழ ஜூஸ் (500மி.லி)",
  "Coconut Water (1 pc)": "இளநீர் (1 எண்ணிக்கை)",
  "Lemon Ginger Juice (500ml)": "எலுமிச்சை இஞ்சி ஜூஸ் (500மி.லி)",
  "Pineapple Juice (500ml)": "அன்னாசி ஜூஸ் (500மி.லி)",
  "Mango Juice (500ml)": "மாம்பழ ஜூஸ் (500மி.லி)",
  "Watermelon Juice (500ml)": "தர்பூசணி ஜூஸ் (500மி.லி)",
  "Carrot Juice (300ml)": "கேரட் ஜூஸ் (300மி.லி)",
  "Pomegranate Juice (300ml)": "மாதுளை ஜூஸ் (300மி.லி)",
  "Guava Juice (500ml)": "கொய்யா ஜூஸ் (500மி.லி)",
  "Apple Juice (500ml)": "ஆப்பிள் ஜூஸ் (500மி.லி)",
  "Grape Juice (300ml)": "திராட்சை ஜூஸ் (300மி.லி)",
  "Spinach Green Juice (300ml)": "கீரை ஜூஸ் (300மி.லி)",
  "Papaya Juice (400ml)": "பப்பாளி ஜூஸ் (400மி.லி)",
  "Rose Milk (300ml)": "ரோஸ் மில்க் (300மி.லி)",

  // Hot Items
  Samosa: "சமோசா",
  Vada: "வடை",
  "Bread Roll": "பிரட் ரோல்",
  "Puff Pastry": "பஃப்",
  Tea: "தேநீர்",
  Coffee: "காபி",
  Poha: "அவல்",
  Upma: "உப்புமா",
  Idli: "இட்லி",
  Dosa: "தோசை",
  "Masala Chai": "மசாலா தேநீர்",
  "Bread (Loaf)": "பிரட்",
  Biscuits: "பிஸ்கட்",
  "Samosa (2 pcs)": "சமோசா (2 எண்ணிக்கை)",
  "Vada (2 pcs)": "வடை (2 எண்ணிக்கை)",
  "Idli (4 pcs)": "இட்லி (4 எண்ணிக்கை)",
  "Pongal (1 plate)": "பொங்கல் (1 தட்டு)",
  "Mirchi Bhaji (3 pcs)": "மிளகாய் பஜ்ஜி (3 எண்ணிக்கை)",
  "Filter Coffee (1 cup)": "ஃபில்டர் காபி (1 கப்)",
  "Masala Dosa (1 pc)": "மசாலா தோசை (1 எண்ணிக்கை)",
  "Upma (1 plate)": "உப்புமா (1 தட்டு)",
  "Puri Bhaji (2 pcs)": "பூரி பாஜி (2 எண்ணிக்கை)",
  "Poha (1 plate)": "அவல் (1 தட்டு)",
  "Chai (1 cup)": "தேநீர் (1 கப்)",
  "Pakora (6 pcs)": "பகோடா (6 எண்ணிக்கை)",
  "Bread Omelette": "பிரட் ஆம்லெட்",
  "Parotta (2 pcs)": "பரோட்டா (2 எண்ணிக்கை)",
  "Aloo Paratha (2 pcs)": "ஆலு பராத்தா (2 எண்ணிக்கை)",
  "Veg Biryani (1 plate)": "வெஜ் பிரியாணி (1 தட்டு)",
  "Onion Uttapam (1 pc)": "வெங்காய உத்தாப்பம் (1 எண்ணிக்கை)",
  "Rava Dosa (1 pc)": "ரவா தோசை (1 எண்ணிக்கை)",
  "Chicken Roll (1 pc)": "சிக்கன் ரோல் (1 எண்ணிக்கை)",

  // Cold Items
  "Vanilla Ice Cream": "வெனிலா ஐஸ்கிரீம்",
  "Chocolate Ice Cream": "சாக்லேட் ஐஸ்கிரீம்",
  "Mango Lassi": "மாம்பழ லஸ்ஸி",
  Buttermilk: "மோர்",
  "Cold Coffee": "கோல்ட் காபி",
  "Coca Cola": "கோகோ கோலா",
  Sprite: "ஸ்பிரைட்",
  "Cold Water": "குளிர்ந்த நீர்",
  "Mango Ice Cream": "மாம்பழ ஐஸ்கிரீம்",
  "Strawberry Ice Cream": "ஸ்ட்ராபெரி ஐஸ்கிரீம்",
  Milkshake: "மில்க்ஷேக்",
  Yogurt: "தயிர்",
  "Fruit Salad": "பழ சாலட்",
  "Ice Cream Vanilla (500ml)": "வெனிலா ஐஸ்கிரீம் (500மி.லி)",
  "Lassi (500ml)": "லஸ்ஸி (500மி.லி)",
  "Buttermilk (500ml)": "மோர் (500மி.லி)",
  "Cold Drinks (300ml)": "குளிர் பானம் (300மி.லி)",
  "Flavoured Milk (200ml)": "ஃப்ளேவர்ட் பால் (200மி.லி)",
  "Frozen Peas (500g)": "உறைந்த பட்டாணி (500கி)",
  "Mango Ice Cream (500ml)": "மாம்பழ ஐஸ்கிரீம் (500மி.லி)",
  "Chocolate Ice Cream (500ml)": "சாக்லேட் ஐஸ்கிரீம் (500மி.லி)",
  "Strawberry Ice Cream (500ml)": "ஸ்ட்ராபெரி ஐஸ்கிரீம் (500மி.லி)",
  "Mango Lassi (300ml)": "மாம்பழ லஸ்ஸி (300மி.லி)",
  "Cold Coffee (300ml)": "கோல்ட் காபி (300மி.லி)",
  "Chocolate Milkshake (300ml)": "சாக்லேட் மில்க்ஷேக் (300மி.லி)",
  "Sprite (300ml)": "ஸ்பிரைட் (300மி.லி)",
  "Tender Coconut Ice Cream": "தேங்காய் ஐஸ்கிரீம்",
  "Yogurt (200g)": "தயிர் (200கி)",
  "Fruit Salad Cup (1 pc)": "பழ சாலட் (1 கப்)",
  "Paneer Ice Cream Bar": "பன்னீர் ஐஸ்கிரீம் பார்",
  "Lemon Soda (300ml)": "எலுமிச்சை சோடா (300மி.லி)",
  "Iced Tea (300ml)": "ஐஸ்டி (300மி.லி)",
  "Kulfi (2 pcs)": "குல்ஃபி (2 எண்ணிக்கை)",
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
  compact?: boolean;
}

export function ProductCard({
  product,
  isAdmin,
  compact = false,
}: ProductCardProps) {
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
  const removeProduct = useRemoveProduct();

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

  function handleRemove() {
    if (!confirm(`Are you sure you want to remove "${product.name}"?`)) return;
    removeProduct.mutate(product.id, {
      onSuccess: () => {
        toast.success("Product removed");
      },
      onError: () => {
        toast.error("Failed to remove product");
      },
    });
  }

  const categoryAccent: Record<string, string> = {
    "Fresh Fruits": "from-red-400 to-orange-400",
    "Fresh Juice": "from-orange-400 to-yellow-400",
    "Hot Items": "from-rose-500 to-red-400",
    "Cold Items": "from-blue-400 to-cyan-400",
    Grocery: "from-green-500 to-emerald-400",
  };
  const accentClass =
    categoryAccent[product.category] ?? "from-green-500 to-emerald-400";

  const categoryBg: Record<string, string> = {
    "Fresh Fruits": "from-red-50 to-orange-100",
    "Fresh Juice": "from-orange-50 to-yellow-100",
    "Hot Items": "from-rose-50 to-red-100",
    "Cold Items": "from-blue-50 to-cyan-100",
    Grocery: "from-green-50 to-emerald-100",
  };
  const bgClass =
    categoryBg[product.category] ?? "from-green-50 to-emerald-100";

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={`group ${!product.available ? "stock-unavailable" : ""}`}
      >
        <Card className="relative overflow-hidden border-[oklch(0.90_0.018_78)] card-shadow hover:card-shadow-hover transition-all duration-300 h-full">
          {/* Accent bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${accentClass}`} />
          {/* Image */}
          <div
            className={`relative w-full aspect-square bg-gradient-to-br ${bgClass}`}
          >
            {imageUrl && !imgError && (
              <img
                src={imageUrl}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
            {(!imageUrl || imgError) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">{icon}</span>
              </div>
            )}
            {!product.available && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="bg-red-600 text-white text-[0.6rem] font-black px-2 py-0.5 rounded uppercase tracking-wide">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <CardContent className="p-3">
            <h3 className="font-display font-bold text-xs leading-tight text-[oklch(0.15_0.05_50)] line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="font-display font-black text-sm text-[oklch(0.36_0.14_152)]">
              {formatPrice(product.price)}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group ${!product.available ? "stock-unavailable" : ""}`}
    >
      <Card className="relative overflow-hidden border-[oklch(0.90_0.018_78)] card-shadow hover:card-shadow-hover transition-all duration-300 h-full flex flex-col">
        {/* Product image section */}
        <div
          className={`relative w-full aspect-[4/3] bg-gradient-to-br ${bgClass} overflow-hidden shrink-0`}
        >
          {imageUrl && !imgError && (
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          )}
          {(!imageUrl || imgError) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-6xl"
                role="img"
                aria-label={product.category}
              >
                {icon}
              </span>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Price chip on image */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="bg-white/95 backdrop-blur-sm text-[oklch(0.30_0.14_152)] font-display font-black text-sm px-2.5 py-1 rounded-lg shadow-sm">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Out of stock overlay */}
          {!product.available && (
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wide shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* Category badge top-left */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm bg-white/80 ${colorClass}`}
            >
              {icon} {product.category}
            </span>
          </div>

          {/* Admin: change image button */}
          {isAdmin && !editingImage && (
            <button
              type="button"
              onClick={() => {
                setImageInput(imageUrl ?? "");
                setImageInputError(false);
                setEditingImage(true);
              }}
              className="absolute top-2.5 right-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              title="Change image"
              data-ocid="product.image.edit_button"
            >
              <ImageIcon className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Image edit overlay */}
          {isAdmin && editingImage && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2.5 p-4 backdrop-blur-sm">
              <p className="text-white text-xs font-bold">Paste Image URL</p>
              <input
                type="url"
                placeholder="https://..."
                value={imageInput}
                onChange={(e) => {
                  setImageInput(e.target.value);
                  setImageInputError(false);
                }}
                className="w-full text-xs px-3 py-2 rounded-lg border border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60"
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
                  className="bg-[oklch(0.40_0.14_152)] hover:bg-[oklch(0.36_0.14_152)] text-white text-xs px-3.5 py-1.5 rounded-lg font-bold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingImage(false)}
                  className="bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Accent bar */}
        <div className={`h-0.5 w-full bg-gradient-to-r ${accentClass}`} />

        <CardContent className="p-3.5 flex flex-col gap-2 flex-1">
          {/* Product name */}
          <div>
            <h3 className="font-display font-bold text-[0.875rem] leading-snug text-[oklch(0.15_0.05_50)] line-clamp-2 group-hover:text-[oklch(0.36_0.14_152)] transition-colors">
              {product.name}
            </h3>
            {PRODUCT_TAMIL_NAMES[product.name] && (
              <p className="text-[0.7rem] text-[oklch(0.40_0.14_152)] font-semibold mt-0.5 leading-none">
                {PRODUCT_TAMIL_NAMES[product.name]}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-[oklch(0.55_0.03_65)] text-[0.72rem] leading-relaxed line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Admin actions */}
          {isAdmin && (
            <div className="pt-2 border-t border-[oklch(0.90_0.018_78)]">
              {editingPrice ? (
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-black text-[oklch(0.36_0.14_152)]">
                      ₹
                    </span>
                    <Input
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="pl-7 h-8 text-sm font-bold"
                      min="0"
                      autoFocus
                      data-ocid="product.price.input"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSavePrice();
                        if (e.key === "Escape") setEditingPrice(false);
                      }}
                    />
                  </div>
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-[oklch(0.40_0.14_152)] hover:bg-[oklch(0.36_0.14_152)] shrink-0"
                    onClick={handleSavePrice}
                    disabled={updatePrice.isPending}
                    data-ocid="product.price.save_button"
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
                    data-ocid="product.price.cancel_button"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-[oklch(0.50_0.03_65)] hover:text-[oklch(0.36_0.14_152)] hover:bg-[oklch(0.92_0.06_148)] flex-1"
                    onClick={() => {
                      setPriceInput(Number(product.price).toString());
                      setEditingPrice(true);
                    }}
                    data-ocid="product.price.edit_button"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit Price
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`h-7 px-2 text-xs ${
                      product.available
                        ? "text-[oklch(0.577_0.245_27)] hover:bg-[oklch(0.577_0.245_27/0.08)]"
                        : "text-green-700 hover:bg-green-50"
                    }`}
                    onClick={handleToggle}
                    disabled={toggleAvailability.isPending}
                    data-ocid="product.availability.toggle"
                  >
                    {toggleAvailability.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-3 w-3 mr-1" />
                    )}
                    {product.available ? "Hide" : "Show"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-[oklch(0.577_0.245_27)] hover:bg-[oklch(0.577_0.245_27/0.08)]"
                    onClick={handleRemove}
                    disabled={removeProduct.isPending}
                    data-ocid="product.delete_button"
                  >
                    {removeProduct.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
