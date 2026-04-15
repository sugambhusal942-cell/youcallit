import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ChevronDownIcon,
  FlameIcon,
  LeafIcon,
  MessageCircleIcon,
  ShoppingCartIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "../store/cartStore";

// ─── Types ──────────────────────────────────────────────────────────────────

interface FeaturedDish {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  tag: string;
}

interface CategoryCard {
  id: number;
  emoji: string;
  name: string;
  description: string;
  image: string;
}

// ─── Static Data ────────────────────────────────────────────────────────────

const FEATURED_DISHES: FeaturedDish[] = [
  {
    id: 1,
    name: "Wagyu Striploin",
    description: "A5 wagyu, truffle jus, gold leaf, microgreens",
    price: "$148",
    image: "/assets/generated/dish-wagyu-beef.dim_600x600.jpg",
    tag: "Chef's Choice",
  },
  {
    id: 2,
    name: "Seared Scallops",
    description: "Trio on cauliflower purée, champagne velouté",
    price: "$68",
    image: "/assets/generated/dish-seared-scallops.dim_600x600.jpg",
    tag: "Signature",
  },
  {
    id: 3,
    name: "Truffle Risotto",
    description: "Arborio, shaved black truffle, parmesan crisp",
    price: "$58",
    image: "/assets/generated/dish-truffle-risotto.dim_600x600.jpg",
    tag: "Vegetarian",
  },
  {
    id: 4,
    name: "Duck Confit",
    description: "Cherry port reduction, pomme purée, roasted veg",
    price: "$72",
    image: "/assets/generated/dish-duck-breast.dim_600x600.jpg",
    tag: "Seasonal",
  },
  {
    id: 5,
    name: "Lobster Bisque",
    description: "Maine lobster, saffron cream, caviar garnish",
    price: "$42",
    image: "/assets/generated/dish-lobster-bisque.dim_600x600.jpg",
    tag: "Fan Favourite",
  },
  {
    id: 6,
    name: "Chocolate Fondant",
    description: "Dark cocoa lava, raspberry coulis, edible gold",
    price: "$28",
    image: "/assets/generated/dish-chocolate-fondant.dim_600x600.jpg",
    tag: "Dessert",
  },
];

const CATEGORIES: CategoryCard[] = [
  {
    id: 1,
    emoji: "🥩",
    name: "Mains",
    description: "Wagyu, duck, sea bass & more",
    image: "/assets/generated/dish-wagyu-beef.dim_600x600.jpg",
  },
  {
    id: 2,
    emoji: "🦞",
    name: "Starters",
    description: "Scallops, bisque & artisan breads",
    image: "/assets/generated/dish-seared-scallops.dim_600x600.jpg",
  },
  {
    id: 3,
    emoji: "🍄",
    name: "Vegetarian",
    description: "Truffle, forest mushrooms, seasonal",
    image: "/assets/generated/dish-truffle-risotto.dim_600x600.jpg",
  },
  {
    id: 4,
    emoji: "🍷",
    name: "Pairings",
    description: "Sommelier-selected wine pairings",
    image: "/assets/generated/restaurant-interior-ambiance.dim_1200x700.jpg",
  },
  {
    id: 5,
    emoji: "🍫",
    name: "Desserts",
    description: "Fondant, soufflé & mignardises",
    image: "/assets/generated/dish-chocolate-fondant.dim_600x600.jpg",
  },
];

const PILLARS = [
  {
    icon: LeafIcon,
    title: "Fresh Ingredients",
    description:
      "Sourced daily from local farms and world-class suppliers. Nothing frozen, nothing compromised.",
  },
  {
    icon: FlameIcon,
    title: "Chef's Craft",
    description:
      "Each plate is a canvas. Our chefs trained at the finest establishments bring years of mastery.",
  },
  {
    icon: SparklesIcon,
    title: "Your Wish, Our Command",
    description:
      "Dietary need? Flavor preference? Special occasion? Call it — we'll create something extraordinary.",
  },
];

const CHEF_BULLETS = [
  "Real-time messaging during your order",
  "Custom modifications, no limits",
  "Allergy & dietary accommodations",
  "Surprise menu requests welcomed",
];

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

function AnimatedLogo() {
  const charData = [
    { id: "y", c: "y" },
    { id: "o", c: "o" },
    { id: "u", c: "u" },
    { id: "C", c: "C" },
    { id: "a", c: "a" },
    { id: "l1", c: "l" },
    { id: "l2", c: "l" },
    { id: "I", c: "I" },
    { id: "T", c: "T" },
  ];
  return (
    <motion.h1
      className="font-display italic text-[clamp(3.5rem,11vw,8.5rem)] leading-none tracking-tight text-gradient-gold"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.045, delayChildren: 0.3 } },
      }}
      aria-label="youCallIT"
    >
      {charData.map(({ id, c }) => (
        <motion.span
          key={id}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 55, rotateX: -28 },
            show: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              },
            },
          }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function AnimatedTagline() {
  return (
    <motion.div
      className="relative inline-block"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.18, delayChildren: 0.9 } },
      }}
    >
      <motion.p
        className="font-body text-[clamp(0.9rem,2.2vw,1.3rem)] tracking-[0.28em] uppercase text-foreground/65"
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
        }}
      >
        Fine Dining, Your Way
      </motion.p>
      <motion.div
        className="h-px mt-2.5 rounded-full origin-left"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.68 0.18 65) 50%, transparent 100%)",
        }}
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: {
            scaleX: 1,
            opacity: 1,
            transition: {
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            },
          },
        }}
      />
    </motion.div>
  );
}

interface DishCardProps {
  dish: FeaturedDish;
  index: number;
}

function DishCard({ dish, index }: DishCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: cy * -13, y: cx * 13 });
  };

  return (
    <motion.div
      ref={ref}
      className="relative flex-shrink-0 w-64 sm:w-72"
      style={{ perspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setTilt({ x: 0, y: 0 });
        setHovered(false);
      }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovered ? 1.04 : 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      data-ocid={`featured_dishes.item.${index + 1}`}
    >
      <div className="bg-card border border-white/8 rounded-2xl overflow-hidden shadow-elevated">
        <div className="relative h-52 overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.09)" : "scale(1)",
              transition: "transform 0.55s ease",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent" />
          <span className="absolute top-3 left-3 text-xs font-body font-semibold tracking-widest uppercase text-primary bg-primary/12 border border-primary/25 px-2.5 py-0.5 rounded-full">
            {dish.tag}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display italic text-xl text-foreground leading-tight">
              {dish.name}
            </h3>
            <p className="text-muted-foreground text-sm font-body mt-0.5 line-clamp-1">
              {dish.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-accent-gold font-body font-semibold text-lg">
              {dish.price}
            </span>
            <Button
              size="sm"
              className="h-8 px-3 text-xs font-body gradient-gold-accent text-primary-foreground border-0 hover:opacity-90 transition-smooth shadow-gold-glow"
              onClick={() =>
                addItem({
                  id: BigInt(dish.id),
                  name: dish.name,
                  price: BigInt(
                    Math.round(
                      Number.parseFloat(dish.price.replace("$", "")) * 100,
                    ),
                  ),
                  imageUrl: dish.image,
                  categoryId: 1n,
                  description: dish.description,
                  isAvailable: true,
                  isPopular: true,
                  tags: [],
                })
              }
              data-ocid={`featured_dishes.add_button.${index + 1}`}
            >
              <ShoppingCartIcon className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const CHAT_BUBBLES = [
  {
    id: "b1",
    text: "Can I get extra truffle on the risotto?",
    from: "customer",
  },
  {
    id: "b2",
    text: "Absolument! Adding generous shavings now 🍄",
    from: "chef",
  },
  { id: "b3", text: "Also make it dairy-free please 🙏", from: "customer" },
  {
    id: "b4",
    text: "Done — switching to cashew cream. Excellent choice.",
    from: "chef",
  },
] as const;

function ChefChatPreview() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= CHAT_BUBBLES.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 900);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="space-y-3 min-h-[200px]" data-ocid="chef_chat.preview">
      <AnimatePresence>
        {CHAT_BUBBLES.slice(0, visible).map((b) => (
          <motion.div
            key={b.id}
            className={`flex ${b.from === "chef" ? "justify-start" : "justify-end"}`}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm font-body max-w-[88%] leading-relaxed ${
                b.from === "chef"
                  ? "bg-primary/12 border border-primary/22 text-foreground rounded-tl-sm"
                  : "bg-card border border-white/10 text-foreground/80 rounded-tr-sm"
              }`}
            >
              {b.from === "chef" && (
                <span className="text-xs font-semibold text-primary block mb-0.5 tracking-wide">
                  Chef Alexandre
                </span>
              )}
              {b.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 110]);
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0]);
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-ocid="home.hero_section"
      >
        {/* Parallax BG */}
        <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
          <img
            src="/assets/generated/hero-signature-dish.dim_1600x900.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 68% 38%, oklch(0.68 0.18 65 / 0.07) 0%, transparent 55%)",
            }}
          />
        </motion.div>

        {/* Ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {(["p0", "p1", "p2", "p3", "p4", "p5", "p6"] as const).map(
            (pid, i) => (
              <motion.div
                key={pid}
                className="absolute rounded-full"
                style={{
                  background: "oklch(0.68 0.18 65 / 0.45)",
                  width: i % 2 === 0 ? 3 : 2,
                  height: i % 2 === 0 ? 3 : 2,
                  left: `${18 + i * 11}%`,
                  top: `${25 + (i % 4) * 16}%`,
                }}
                animate={{ y: [0, -18, 0], opacity: [0.25, 0.7, 0.25] }}
                transition={{
                  duration: 3.2 + i * 0.45,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.35,
                }}
              />
            ),
          )}
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-4 sm:px-8 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          {/* Eyebrow */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-7"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
          >
            <div className="section-divider w-14" />
            <span className="text-xs font-body tracking-[0.32em] uppercase text-primary font-semibold whitespace-nowrap">
              Michelin Fine Dining Experience
            </span>
            <div className="section-divider w-14" />
          </motion.div>

          <AnimatedLogo />

          <div className="mt-5 mb-9">
            <AnimatedTagline />
          </div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <Link to="/menu" data-ocid="home.explore_menu_button">
              <Button
                size="lg"
                className="min-w-[200px] h-14 text-sm font-body tracking-[0.2em] uppercase gradient-gold-accent text-primary-foreground border-0 shadow-gold-glow hover:scale-105 hover:shadow-[0_0_30px_rgba(173,142,70,0.4)] transition-all duration-300"
              >
                Explore Menu
              </Button>
            </Link>
            <Link to="/reservations" data-ocid="home.reserve_table_button">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] h-14 text-sm font-body tracking-[0.2em] uppercase border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary/65 hover:scale-105 transition-all duration-300"
              >
                Reserve a Table
              </Button>
            </Link>
          </motion.div>

          {/* Stars */}
          <motion.div
            className="flex items-center justify-center gap-1.5 mt-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.45 }}
          >
            {(["s1", "s2", "s3", "s4", "s5"] as const).map((sid) => (
              <StarIcon
                key={sid}
                className="w-4 h-4 text-primary fill-primary"
              />
            ))}
            <span className="ml-2 text-xs font-body text-muted-foreground tracking-[0.22em] uppercase">
              Award-Winning Experience
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.65 }}
          data-ocid="home.scroll_indicator"
        >
          <span className="text-xs font-body tracking-[0.28em] uppercase text-muted-foreground">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 1.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ChevronDownIcon className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURED DISHES ── */}
      <section
        className="py-24 bg-card overflow-hidden"
        data-ocid="home.featured_dishes_section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-xs font-body tracking-[0.3em] uppercase text-primary mb-3">
              Tonight's Selection
            </p>
            <h2 className="font-display italic text-4xl sm:text-5xl text-foreground mb-4">
              Featured Dishes
            </h2>
            <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
              Hand-selected by our executive chef. Each plate is an experience
              unto itself.
            </p>
          </motion.div>

          {/* Horizontal scroll */}
          <div
            className="flex gap-5 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            data-ocid="featured_dishes.carousel"
          >
            {FEATURED_DISHES.map((dish, idx) => (
              <DishCard key={dish.id} dish={dish} index={idx} />
            ))}
          </div>

          <motion.div
            className="flex justify-center mt-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Link to="/menu" data-ocid="home.view_full_menu_button">
              <Button
                variant="outline"
                className="font-body tracking-[0.18em] uppercase border-primary/30 text-foreground hover:bg-primary/8 hover:border-primary/55 transition-smooth"
              >
                View Full Menu
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── RESTAURANT STORY ── */}
      <section
        className="relative py-28 bg-background overflow-hidden"
        data-ocid="home.story_section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              className="relative"
              variants={slideLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-elevated aspect-[4/3]">
                <img
                  src="/assets/generated/restaurant-interior-ambiance.dim_1200x700.jpg"
                  alt="Restaurant interior"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.12 0.018 50 / 0.28) 0%, transparent 55%)",
                  }}
                />
              </div>
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-5 -right-4 sm:-right-6 bg-card border border-primary/22 rounded-2xl px-5 py-4 shadow-elevated"
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-gold-accent flex items-center justify-center">
                    <StarIcon className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-foreground font-body font-semibold text-sm">
                      Michelin Recognition
                    </p>
                    <p className="text-muted-foreground font-body text-xs">
                      Est. 2019
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Copy */}
            <motion.div
              className="space-y-6"
              variants={slideRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <p className="text-xs font-body tracking-[0.3em] uppercase text-primary">
                Our Story
              </p>
              <h2 className="font-display italic text-4xl sm:text-5xl text-foreground leading-[1.15]">
                A Culinary Journey
                <br />
                <span className="text-gradient-gold">Without Limits</span>
              </h2>
              <blockquote className="border-l-2 border-primary/45 pl-5 py-1">
                <p className="font-display italic text-xl text-foreground/75 leading-relaxed">
                  "At youCallIT, dining is the most personal art form. Tell us
                  your dream dish — we'll make it real."
                </p>
                <footer className="mt-3 text-sm font-body text-muted-foreground tracking-wide">
                  — Chef Alexandre Dubois, Executive Chef
                </footer>
              </blockquote>
              <p className="text-muted-foreground font-body leading-relaxed text-sm">
                Born from the belief that fine dining should adapt to you — not
                the other way around. Our kitchen runs on one promise: if you
                dream it, we craft it. No restrictions. No compromises. Just
                pure culinary excellence, plated for you.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-3">
                {[
                  { number: "12+", label: "Years of Craft" },
                  { number: "40K+", label: "Happy Guests" },
                  { number: "300+", label: "Unique Dishes" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display italic text-3xl text-accent-gold">
                      {stat.number}
                    </p>
                    <p className="text-xs font-body text-muted-foreground mt-1 tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <section className="py-24 bg-card" data-ocid="home.features_section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-xs font-body tracking-[0.3em] uppercase text-primary mb-3">
              Why youCallIT
            </p>
            <h2 className="font-display italic text-4xl sm:text-5xl text-foreground">
              Three Pillars of Excellence
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                className="group relative p-8 rounded-2xl border border-white/8 bg-background hover:border-primary/25 transition-smooth hover:shadow-gold-glow"
                variants={fadeUp}
                whileHover={{ y: -5 }}
                data-ocid={`home.feature_card.${i + 1}`}
              >
                <div className="w-14 h-14 rounded-2xl gradient-gold-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth shadow-gold-glow">
                  <pillar.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display italic text-2xl text-foreground mb-3">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed text-sm">
                  {pillar.description}
                </p>
                {/* Hover bottom accent */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl origin-left"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.68 0.18 65 / 0.5), transparent)",
                  }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.28 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY SHOWCASE ── */}
      <section
        className="py-24 bg-background"
        data-ocid="home.categories_section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-xs font-body tracking-[0.3em] uppercase text-primary mb-3">
              The Menu
            </p>
            <h2 className="font-display italic text-4xl sm:text-5xl text-foreground">
              Explore the Collection
            </h2>
            <p className="text-muted-foreground font-body mt-4 max-w-md mx-auto text-sm">
              Every category is a world unto itself — crafted with intention,
              plated with artistry.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                className="group relative rounded-2xl overflow-hidden border border-white/8 cursor-pointer"
                style={{ aspectRatio: "3/4" }}
                variants={fadeUp}
                onHoverStart={() => setHoveredCat(cat.id)}
                onHoverEnd={() => setHoveredCat(null)}
                whileHover={{ scale: 1.035, zIndex: 10 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                }}
                data-ocid={`home.category_card.${i + 1}`}
              >
                <Link to="/menu">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform:
                        hoveredCat === cat.id ? "scale(1.12)" : "scale(1)",
                      transition: "transform 0.55s ease",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 space-y-1">
                    <span className="text-xl block">{cat.emoji}</span>
                    <h3 className="font-display italic text-lg text-foreground leading-tight">
                      {cat.name}
                    </h3>
                    <motion.p
                      className="text-xs font-body text-muted-foreground leading-snug overflow-hidden"
                      animate={{
                        opacity: hoveredCat === cat.id ? 1 : 0,
                        height: hoveredCat === cat.id ? "auto" : 0,
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      {cat.description}
                    </motion.p>
                  </div>

                  {/* Gold border glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none border-2"
                    animate={{
                      borderColor:
                        hoveredCat === cat.id
                          ? "oklch(0.68 0.18 65 / 0.4)"
                          : "oklch(0.68 0.18 65 / 0)",
                    }}
                    transition={{ duration: 0.25 }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CHEF CHAT CTA ── */}
      <section
        className="relative py-28 overflow-hidden bg-card"
        data-ocid="home.chef_chat_section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 28% 50%, oklch(0.68 0.18 65 / 0.055) 0%, transparent 55%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Chat preview */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="bg-background border border-white/8 rounded-3xl p-6 shadow-elevated">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/8">
                  <div className="w-10 h-10 rounded-full gradient-gold-accent flex items-center justify-center flex-shrink-0 shadow-gold-glow">
                    <MessageCircleIcon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-foreground font-body font-semibold text-sm">
                      Live Chef Chat
                    </p>
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "oklch(0.62 0.18 145)" }}
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                      <p className="text-xs font-body text-muted-foreground">
                        Chef online — avg. 2 min response
                      </p>
                    </div>
                  </div>
                </div>

                <ChefChatPreview />

                {/* Input mock */}
                <div className="mt-5 flex items-center gap-2 bg-muted/40 rounded-xl px-4 py-2.5 border border-white/8">
                  <p className="text-sm font-body text-muted-foreground/55 flex-1">
                    Type your request...
                  </p>
                  <div className="w-7 h-7 rounded-lg gradient-gold-accent flex items-center justify-center flex-shrink-0">
                    <MessageCircleIcon className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Copy */}
            <motion.div
              className="space-y-6"
              variants={slideRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <p className="text-xs font-body tracking-[0.3em] uppercase text-primary">
                Direct Connection
              </p>
              <h2 className="font-display italic text-4xl sm:text-5xl text-foreground leading-[1.15]">
                Speak Directly
                <br />
                <span className="text-gradient-gold">to the Chef</span>
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed text-sm">
                Every order opens a private line between you and the kitchen. No
                middlemen, no guesswork. Ask for alterations, request secret
                menu items, share allergies, or simply say hello. Chef Alexandre
                responds personally.
              </p>

              <ul className="space-y-3">
                {CHEF_BULLETS.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-3 text-sm font-body text-foreground/80"
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>

              <div className="pt-2">
                <Link to="/menu" data-ocid="home.order_now_button">
                  <Button
                    size="lg"
                    className="h-12 px-8 font-body tracking-[0.18em] uppercase gradient-gold-accent text-primary-foreground border-0 shadow-gold-glow hover:opacity-90 hover:scale-105 transition-all duration-300"
                  >
                    Order & Chat Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="relative py-32 overflow-hidden bg-background"
        data-ocid="home.final_cta_section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.68 0.18 65 / 0.07) 0%, transparent 62%)",
          }}
        />
        <div className="section-divider absolute top-0 inset-x-0" />
        <div className="section-divider absolute bottom-0 inset-x-0" />

        <motion.div
          className="max-w-3xl mx-auto px-4 text-center space-y-8"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.p
            className="text-xs font-body tracking-[0.3em] uppercase text-primary"
            variants={fadeUp}
          >
            Reserve Your Evening
          </motion.p>
          <motion.h2
            className="font-display italic text-5xl sm:text-6xl text-foreground leading-tight"
            variants={fadeUp}
          >
            Your Table Awaits
          </motion.h2>
          <motion.p
            className="text-muted-foreground font-body text-base leading-relaxed"
            variants={fadeUp}
          >
            Every evening at youCallIT is a singular experience. Reserve your
            table and let us craft a night you'll talk about for years.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeUp}
          >
            <Link to="/reservations" data-ocid="home.final_reserve_button">
              <Button
                size="lg"
                className="min-w-[220px] h-14 text-sm font-body tracking-[0.2em] uppercase gradient-gold-accent text-primary-foreground border-0 shadow-gold-glow hover:scale-105 hover:shadow-[0_0_30px_rgba(173,142,70,0.4)] transition-all duration-300"
              >
                Make a Reservation
              </Button>
            </Link>
            <Link to="/menu" data-ocid="home.final_menu_button">
              <Button
                size="lg"
                variant="ghost"
                className="min-w-[180px] h-14 text-sm font-body tracking-[0.2em] uppercase text-foreground/65 hover:text-foreground hover:bg-white/5 transition-smooth"
              >
                Browse Menu
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
