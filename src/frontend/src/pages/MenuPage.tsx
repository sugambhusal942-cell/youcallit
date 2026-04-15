import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchIcon,
  SparklesIcon,
  UtensilsCrossedIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy, useMemo, useState } from "react";
import { MenuItemCard } from "../components/MenuItemCard";
import { MenuItemModal } from "../components/MenuItemModal";
import { useMenuCategories, useMenuItems } from "../hooks/useQueries";
import type { MenuItem } from "../types";

// Lazy-load the 3D scene (avoids blocking initial render)
const Scene3D = lazy(() =>
  import("../components/Scene3D").then((m) => ({ default: m.Scene3D })),
);

// Map 3D category labels → real category names (fuzzy match)
const LABEL_TO_CATEGORY: Record<string, string[]> = {
  Starters: ["starters", "appetizers", "starter", "appetizer", "small plates"],
  Mains: [
    "mains",
    "main",
    "entrees",
    "entree",
    "entrées",
    "entrée",
    "mains course",
  ],
  Desserts: ["desserts", "dessert", "sweets", "sweet"],
  Drinks: [
    "drinks",
    "beverages",
    "beverage",
    "drink",
    "cocktails",
    "cocktail",
    "wines",
    "wine",
  ],
  "Chef Specials": [
    "chef",
    "specials",
    "special",
    "signature",
    "chef's",
    "chef specials",
  ],
};

function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 9 }, (_, i) => `sk-${i}`).map((key) => (
        <div
          key={key}
          className="rounded-2xl overflow-hidden bg-card border border-white/5"
        >
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [active3DLabel, setActive3DLabel] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { data: categories, isLoading: catLoading } = useMenuCategories();
  const { data: menuItems, isLoading: itemsLoading } = useMenuItems();

  // Handle 3D orbital category click → match to real category id
  function handle3DSelect(label: string) {
    if (label === active3DLabel) {
      setActive3DLabel("all");
      setActiveCategory("all");
      return;
    }
    setActive3DLabel(label);
    const synonyms = LABEL_TO_CATEGORY[label] ?? [label.toLowerCase()];
    const matched = categories?.find((c) =>
      synonyms.some((syn) => c.name.toLowerCase().includes(syn)),
    );
    setActiveCategory(matched ? matched.id.toString() : "all");
  }

  const filtered = useMemo(() => {
    if (!menuItems) return [];
    let result = menuItems.filter((i) => i.isAvailable);
    if (activeCategory !== "all") {
      result = result.filter((i) => i.categoryId.toString() === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [menuItems, activeCategory, search]);

  const isLoading = catLoading || itemsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* === 3D Hero Banner === */}
      <section
        className="relative overflow-hidden bg-card border-b border-white/5"
        data-ocid="menu.hero_section"
        style={{ minHeight: 340 }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/menu-3d-hero.dim_1600x900.jpg"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-card/70 via-card/50 to-card" />
        </div>

        {/* Gold radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%, oklch(0.68 0.18 65 / 0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-4">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-1"
          >
            <p className="text-xs font-body font-semibold tracking-[0.22em] uppercase text-primary mb-2">
              Crafted to Perfection
            </p>
            <h1 className="font-display italic text-5xl md:text-6xl text-gradient-gold leading-none mb-1">
              Our Menu
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-2">
              Every dish is a canvas — you call it, Chef creates it.
            </p>
          </motion.div>

          {/* 3D Orbital Scene */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[220px] gap-2 text-muted-foreground text-sm font-body">
                  <SparklesIcon className="w-4 h-4 animate-pulse text-primary" />
                  Loading experience…
                </div>
              }
            >
              <Scene3D
                activeCategory={active3DLabel}
                onSelect={handle3DSelect}
              />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* === Search + Filters === */}
      <section className="sticky top-[64px] md:top-[80px] z-30 bg-background/90 backdrop-blur-md border-b border-white/5 py-4 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search dishes, ingredients, flavors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 bg-card border-border/30 font-body focus:border-primary/40 transition-smooth h-11"
              data-ocid="menu.search_input"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  data-ocid="menu.search_clear_button"
                >
                  <XIcon className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Category filter pills */}
          <div
            className="flex flex-wrap gap-2"
            data-ocid="menu.category_filters"
          >
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setActive3DLabel("all");
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-smooth border ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-gold-glow"
                  : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
              data-ocid="menu.category_all_pill"
            >
              All Dishes
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id.toString()}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id.toString());
                  setActive3DLabel("all");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-smooth border ${
                  activeCategory === cat.id.toString()
                    ? "bg-primary text-primary-foreground border-primary shadow-gold-glow"
                    : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
                data-ocid={`menu.category_pill.${cat.id.toString()}`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* === Menu Grid === */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results count */}
        {!isLoading && (
          <motion.p
            key={filtered.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground font-body mb-6"
          >
            {filtered.length} dish{filtered.length !== 1 ? "es" : ""}
            {search ? ` for "${search}"` : ""}
            {activeCategory !== "all"
              ? ` in ${categories?.find((c) => c.id.toString() === activeCategory)?.name ?? "category"}`
              : ""}
          </motion.p>
        )}

        {isLoading ? (
          <MenuSkeleton />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-5 text-center"
            data-ocid="menu.empty_state"
          >
            <div className="w-20 h-20 rounded-full bg-card border border-white/8 flex items-center justify-center shadow-luxury">
              <UtensilsCrossedIcon className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-foreground font-body font-semibold text-lg mb-1">
                The kitchen's stumped
              </p>
              <p className="text-muted-foreground font-body text-sm max-w-xs">
                {search
                  ? `No dishes match "${search}". Our chef is versatile, but even magic has limits.`
                  : "No dishes in this category yet. Check back soon."}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border/40 font-body hover:border-primary/40 transition-smooth"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
                setActive3DLabel("all");
              }}
              data-ocid="menu.clear_filter_button"
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="menu.items_grid"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <MenuItemCard
                  key={item.id.toString()}
                  item={item}
                  index={i}
                  onOpenModal={setSelectedItem}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* === Item Detail Modal === */}
      <MenuItemModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
