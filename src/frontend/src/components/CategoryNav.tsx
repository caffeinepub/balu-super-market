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
}

export function CategoryNav({ active, onChange, counts }: CategoryNavProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1 min-w-max px-1">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.value;
          const count = counts?.[cat.value];
          return (
            <motion.button
              key={cat.value}
              onClick={() => onChange(cat.value)}
              whileTap={{ scale: 0.96 }}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold
                transition-all duration-200 border whitespace-nowrap
                ${
                  isActive
                    ? "bg-market-green text-white border-market-green shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-market-green/40 hover:text-market-green hover:bg-market-green-light"
                }
              `}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{cat.label}</span>
              {count !== undefined && (
                <span
                  className={`
                  text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[1.25rem] text-center
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }
                `}
                >
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
