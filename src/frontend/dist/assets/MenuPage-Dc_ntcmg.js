const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Scene3D-BDwTvXFh.js","assets/index-BMSJKAYU.js","assets/index-DeS5VVwb.css"])))=>i.map(i=>d[i]);
import { x as useCartStore, j as reactExports, q as jsxRuntimeExports, t as motion, U as UtensilsCrossed, y as Badge, P as PriceDisplay, B as Button, z as Plus, R as Root, C as Content, D as Close, X, E as cn, T as Title, F as Portal, O as Overlay, G as Minus, S as ShoppingCart, H as ue, A as AnimatePresence, _ as __vitePreload } from "./index-BMSJKAYU.js";
import { I as Input } from "./input-Bh-soQlE.js";
import { S as Skeleton } from "./skeleton-Cy9m2DLt.js";
import { D as DietaryBadge, S as Search } from "./DietaryBadge-ClmCIahB.js";
import { S as Star } from "./star-CizS4Nlo.js";
import { T as Textarea } from "./textarea-ISgui2tl.js";
import { F as Flame, S as Sparkles } from "./sparkles-bNjp5k0Y.js";
import { u as useMenuCategories, a as useMenuItems } from "./useQueries-O8-RsMEM.js";
function MenuItemCard({ item, index, onOpenModal }) {
  const addItem = useCartStore((s) => s.addItem);
  const cardRef = reactExports.useRef(null);
  const [tiltStyle, setTiltStyle] = reactExports.useState({});
  function handleMouseMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTiltStyle({
      transform: `perspective(900px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale3d(1.025, 1.025, 1.025)`,
      transition: "transform 0.05s linear"
    });
  }
  function handleMouseLeave() {
    setTiltStyle({
      transform: "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)",
      transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.45,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      },
      "data-ocid": `menu.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: cardRef,
          style: tiltStyle,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          className: "group bg-card border border-white/8 rounded-2xl overflow-hidden hover:border-primary/30 shadow-luxury-sm hover:shadow-luxury flex flex-col h-full will-change-transform",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "relative block overflow-hidden bg-secondary/30 w-full",
                style: { height: 196 },
                onClick: () => onOpenModal(item),
                "data-ocid": `menu.item_image_button.${index + 1}`,
                "aria-label": `View details for ${item.name}`,
                children: [
                  item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: item.imageUrl,
                      alt: item.name,
                      className: "w-full h-full object-cover group-hover:scale-108 transition-all duration-700 ease-out",
                      style: { transformOrigin: "center" }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-12 h-12 text-muted-foreground/20" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth bg-gradient-to-br from-primary/5 via-transparent to-transparent" }),
                  item.isPopular && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute top-2.5 right-2.5 bg-primary/20 text-primary border border-primary/40 text-xs backdrop-blur-sm shadow-gold-glow", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-2.5 h-2.5 mr-1 fill-current" }),
                    "Popular"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2.5 right-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PriceDisplay,
                    {
                      cents: item.price,
                      className: "text-sm font-body font-bold text-primary bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-primary/25"
                    }
                  ) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onOpenModal(item),
                  className: "text-left mb-1.5",
                  "data-ocid": `menu.item_name_button.${index + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-smooth line-clamp-1", children: item.name })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-xs line-clamp-2 mb-3 flex-1 leading-relaxed", children: item.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap mb-3 min-h-[22px]", children: [
                item.calories != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-body bg-muted/50 px-1.5 py-0.5 rounded-md", children: [
                  Number(item.calories),
                  " cal"
                ] }),
                item.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(DietaryBadge, { tag }, tag)),
                item.tags.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-body", children: [
                  "+",
                  item.tags.length - 2
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "w-full gradient-gold-accent border-0 text-primary-foreground text-xs font-body font-semibold hover:opacity-90 transition-smooth shadow-gold-glow group/btn",
                  onClick: () => addItem(item),
                  "data-ocid": `menu.add_to_cart_button.${index + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1.5 group-hover/btn:rotate-90 transition-smooth" }),
                    "Add to Order"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function MenuItemModal({ item, open, onClose }) {
  const [quantity, setQuantity] = reactExports.useState(1);
  const [instructions, setInstructions] = reactExports.useState("");
  const addItem = useCartStore((s) => s.addItem);
  function handleAdd() {
    if (!item) return;
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    if (instructions.trim()) {
      useCartStore.getState().updateInstructions(item.id, instructions);
    }
    ue.success(`${quantity}× ${item.name} added to order`, {
      description: instructions.trim() ? `Note: ${instructions}` : void 0,
      duration: 3e3
    });
    setQuantity(1);
    setInstructions("");
    onClose();
  }
  function handleClose(v) {
    if (!v) {
      setQuantity(1);
      setInstructions("");
      onClose();
    }
  }
  const totalPrice = item ? Number(item.price) * quantity : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogContent,
    {
      className: "bg-card border-white/10 max-w-md p-0 overflow-hidden rounded-2xl",
      "data-ocid": "menu.item_detail_dialog",
      children: item && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-56 overflow-hidden", children: [
          item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: item.imageUrl,
              alt: item.name,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-secondary/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-16 h-16 text-muted-foreground/20" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-card via-black/30 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PriceDisplay,
            {
              cents: item.price,
              className: "text-xl font-body font-bold text-primary drop-shadow-lg"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-3 pb-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-body font-bold text-lg text-foreground leading-snug", children: item.name }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm leading-relaxed", children: item.description }),
          item.calories != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5 text-primary/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Number(item.calories),
              " calories per serving"
            ] })
          ] }),
          item.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: item.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(DietaryBadge, { tag }, tag)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-divider" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "menu-item-instructions",
                className: "text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Special Instructions"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "menu-item-instructions",
                placeholder: "Allergies, preferences, substitutions…",
                value: instructions,
                onChange: (e) => setInstructions(e.target.value),
                className: "bg-secondary/40 border-border/40 font-body text-sm resize-none h-20 focus:border-primary/40",
                "data-ocid": "menu.item_instructions_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0 border border-border/40 rounded-lg overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "w-9 h-9 flex items-center justify-center hover:bg-white/8 transition-smooth text-muted-foreground hover:text-foreground",
                  onClick: () => setQuantity((q) => Math.max(1, q - 1)),
                  "data-ocid": "menu.item_qty_decrease_button",
                  "aria-label": "Decrease quantity",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-10 text-center text-sm font-body font-semibold text-foreground",
                  "data-ocid": "menu.item_qty_display",
                  children: quantity
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "w-9 h-9 flex items-center justify-center hover:bg-white/8 transition-smooth text-muted-foreground hover:text-foreground",
                  onClick: () => setQuantity((q) => Math.min(20, q + 1)),
                  "data-ocid": "menu.item_qty_increase_button",
                  "aria-label": "Increase quantity",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "flex-1 gradient-gold-accent border-0 text-primary-foreground font-body font-semibold hover:opacity-90 transition-smooth shadow-gold-glow",
                onClick: handleAdd,
                "data-ocid": "menu.item_add_to_cart_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-4 h-4 mr-2" }),
                  "Add ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary-foreground/80 ml-1", children: [
                    "(",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { cents: totalPrice }),
                    ")"
                  ] })
                ]
              }
            )
          ] })
        ] })
      ] })
    }
  ) });
}
const Scene3D = reactExports.lazy(
  () => __vitePreload(() => import("./Scene3D-BDwTvXFh.js"), true ? __vite__mapDeps([0,1,2]) : void 0).then((m) => ({ default: m.Scene3D }))
);
const LABEL_TO_CATEGORY = {
  Starters: ["starters", "appetizers", "starter", "appetizer", "small plates"],
  Mains: [
    "mains",
    "main",
    "entrees",
    "entree",
    "entrées",
    "entrée",
    "mains course"
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
    "wine"
  ],
  "Chef Specials": [
    "chef",
    "specials",
    "special",
    "signature",
    "chef's",
    "chef specials"
  ]
};
function MenuSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: Array.from({ length: 9 }, (_, i) => `sk-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl overflow-hidden bg-card border border-white/5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-lg" })
        ] })
      ]
    },
    key
  )) });
}
function MenuPage() {
  var _a;
  const [search, setSearch] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const [active3DLabel, setActive3DLabel] = reactExports.useState("all");
  const [selectedItem, setSelectedItem] = reactExports.useState(null);
  const { data: categories, isLoading: catLoading } = useMenuCategories();
  const { data: menuItems, isLoading: itemsLoading } = useMenuItems();
  function handle3DSelect(label) {
    if (label === active3DLabel) {
      setActive3DLabel("all");
      setActiveCategory("all");
      return;
    }
    setActive3DLabel(label);
    const synonyms = LABEL_TO_CATEGORY[label] ?? [label.toLowerCase()];
    const matched = categories == null ? void 0 : categories.find(
      (c) => synonyms.some((syn) => c.name.toLowerCase().includes(syn))
    );
    setActiveCategory(matched ? matched.id.toString() : "all");
  }
  const filtered = reactExports.useMemo(() => {
    if (!menuItems) return [];
    let result = menuItems.filter((i) => i.isAvailable);
    if (activeCategory !== "all") {
      result = result.filter((i) => i.categoryId.toString() === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [menuItems, activeCategory, search]);
  const isLoading = catLoading || itemsLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative overflow-hidden bg-card border-b border-white/5",
        "data-ocid": "menu.hero_section",
        style: { minHeight: 340 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "/assets/generated/menu-3d-hero.dim_1600x900.jpg",
                alt: "",
                className: "w-full h-full object-cover opacity-30"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-card/70 via-card/50 to-card" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "radial-gradient(ellipse 60% 55% at 50% 50%, oklch(0.68 0.18 65 / 0.07) 0%, transparent 70%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5 },
                className: "text-center mb-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body font-semibold tracking-[0.22em] uppercase text-primary mb-2", children: "Crafted to Perfection" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display italic text-5xl md:text-6xl text-gradient-gold leading-none mb-1", children: "Our Menu" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mt-2", children: "Every dish is a canvas — you call it, Chef creates it." })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.25, duration: 0.7 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  reactExports.Suspense,
                  {
                    fallback: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center h-[220px] gap-2 text-muted-foreground text-sm font-body", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 animate-pulse text-primary" }),
                      "Loading experience…"
                    ] }),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Scene3D,
                      {
                        activeCategory: active3DLabel,
                        onSelect: handle3DSelect
                      }
                    )
                  }
                )
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "sticky top-[64px] md:top-[80px] z-30 bg-background/90 backdrop-blur-md border-b border-white/5 py-4 shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search dishes, ingredients, flavors…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-10 pr-10 bg-card border-border/30 font-body focus:border-primary/40 transition-smooth h-11",
            "data-ocid": "menu.search_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: search && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            type: "button",
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
            transition: { duration: 0.15 },
            className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth",
            onClick: () => setSearch(""),
            "aria-label": "Clear search",
            "data-ocid": "menu.search_clear_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-wrap gap-2",
          "data-ocid": "menu.category_filters",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setActiveCategory("all");
                  setActive3DLabel("all");
                },
                className: `px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-smooth border ${activeCategory === "all" ? "bg-primary text-primary-foreground border-primary shadow-gold-glow" : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
                "data-ocid": "menu.category_all_pill",
                children: "All Dishes"
              }
            ),
            categories == null ? void 0 : categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  setActiveCategory(cat.id.toString());
                  setActive3DLabel("all");
                },
                className: `px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-smooth border ${activeCategory === cat.id.toString() ? "bg-primary text-primary-foreground border-primary shadow-gold-glow" : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
                "data-ocid": `menu.category_pill.${cat.id.toString()}`,
                children: [
                  cat.emoji,
                  " ",
                  cat.name
                ]
              },
              cat.id.toString()
            ))
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
      !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.p,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "text-xs text-muted-foreground font-body mb-6",
          children: [
            filtered.length,
            " dish",
            filtered.length !== 1 ? "es" : "",
            search ? ` for "${search}"` : "",
            activeCategory !== "all" ? ` in ${((_a = categories == null ? void 0 : categories.find((c) => c.id.toString() === activeCategory)) == null ? void 0 : _a.name) ?? "category"}` : ""
          ]
        },
        filtered.length
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(MenuSkeleton, {}) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "flex flex-col items-center justify-center py-24 gap-5 text-center",
          "data-ocid": "menu.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-card border border-white/8 flex items-center justify-center shadow-luxury", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-8 h-8 text-muted-foreground/30" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-semibold text-lg mb-1", children: "The kitchen's stumped" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm max-w-xs", children: search ? `No dishes match "${search}". Our chef is versatile, but even magic has limits.` : "No dishes in this category yet. Check back soon." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "border-border/40 font-body hover:border-primary/40 transition-smooth",
                onClick: () => {
                  setSearch("");
                  setActiveCategory("all");
                  setActive3DLabel("all");
                },
                "data-ocid": "menu.clear_filter_button",
                children: "Reset Filters"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
          "data-ocid": "menu.items_grid",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            MenuItemCard,
            {
              item,
              index: i,
              onOpenModal: setSelectedItem
            },
            item.id.toString()
          )) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemModal,
      {
        item: selectedItem,
        open: !!selectedItem,
        onClose: () => setSelectedItem(null)
      }
    )
  ] });
}
export {
  MenuPage as default
};
