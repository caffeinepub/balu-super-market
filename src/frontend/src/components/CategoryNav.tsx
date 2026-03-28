import { Sparkles, Tag } from "lucide-react";
import { motion } from "motion/react";

const CATEGORIES = [
  { label: "All", icon: "🛍️", value: "All" },
  { label: "Grocery", icon: "🛒", value: "Grocery" },
  { label: "Fresh Fruits", icon: "🍎", value: "Fresh Fruits" },
  { label: "Fresh Juice", icon: "🥤", value: "Fresh Juice" },
  { label: "Hot Items", icon: "🔥", value: "Hot Items" },
  { label: "Cold Items", icon: "❄️", value: "Cold Items" },
];

interface CategoryNavProps {
  active: string;
  onChange: (category: string) => void;
  counts?: Record<string, number>;
  showDeals?: boolean;
  onShowDeals?: () => void;
  showNew?: boolean;
  onShowNew?: () => void;
}

export function CategoryNav({
  active,
  onChange,
  counts,
  showDeals,
  onShowDeals,
  showNew,
  onShowNew,
}: CategoryNavProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2.5 pb-1 min-w-max px-0.5">
        {/* Today's Deals button */}
        <motion.button
          onClick={onShowDeals}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.02 }}
          data-ocid="deals.tab"
          className={`
            relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
            transition-all duration-200 border whitespace-nowrap select-none
            ${
              showDeals
                ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30"
                : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 hover:border-amber-400"
            }
          `}
        >
          <Tag className="h-4 w-4" />
          <span>Today's Deals 🏷️</span>
          {showDeals && (
            <motion.div
              layoutId="category-indicator"
              className="absolute inset-0 rounded-full"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
        </motion.button>

        {/* New Arrivals button */}
        <motion.button
          onClick={onShowNew}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.02 }}
          data-ocid="new_arrivals.tab"
          className={`
            relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
            transition-all duration-200 border whitespace-nowrap select-none
            ${
              showNew
                ? "bg-[oklch(0.48_0.18_220)] text-white border-[oklch(0.48_0.18_220)] shadow-md shadow-[oklch(0.48_0.18_220/0.30)]"
                : "bg-[oklch(0.95_0.04_220)] text-[oklch(0.35_0.14_220)] border-[oklch(0.78_0.10_220)] hover:bg-[oklch(0.90_0.07_220)] hover:border-[oklch(0.55_0.16_220)]"
            }
          `}
        >
          <Sparkles className="h-4 w-4" />
          <span>New Arrivals 🆕</span>
          {showNew && (
            <motion.div
              layoutId="category-indicator"
              className="absolute inset-0 rounded-full"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
        </motion.button>

        {CATEGORIES.map((cat) => {
          const isActive = !showDeals && !showNew && active === cat.value;
          const count = counts?.[cat.value];
          return (
            <motion.button
              key={cat.value}
              onClick={() => onChange(cat.value)}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              data-ocid={`category.${cat.value.toLowerCase().replace(/\s+/g, "_")}.tab`}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                transition-all duration-200 border whitespace-nowrap select-none
                ${
                  isActive
                    ? "bg-[oklch(0.40_0.14_152)] text-white border-[oklch(0.40_0.14_152)] shadow-md shadow-[oklch(0.40_0.14_152/0.25)]"
                    : "bg-white text-[oklch(0.42_0.04_70)] border-[oklch(0.90_0.018_78)] hover:border-[oklch(0.40_0.14_152/0.4)] hover:text-[oklch(0.36_0.14_152)] hover:bg-[oklch(0.92_0.06_148)]"
                }
              `}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{cat.label}</span>
              {count !== undefined && (
                <span
                  className={`
                    text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[1.25rem] text-center leading-none
                    ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[oklch(0.94_0.012_82)] text-[oklch(0.50_0.03_65)]"
                    }
                  `}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute inset-0 rounded-full"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
