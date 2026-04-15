import { c as createLucideIcon, K as useInternetIdentity, j as reactExports, q as jsxRuntimeExports, $ as LoadingSpinner, S as ShoppingCart, t as motion, A as AnimatePresence, H as ue, a0 as User, B as Button, X, x as useCartStore, a1 as useNavigate, P as PriceDisplay, w as MessageCircle, W as ChefHat } from "./index-BMSJKAYU.js";
import { I as Input } from "./input-Bh-soQlE.js";
import { L as Label } from "./label--nLC03EJ.js";
import { n as useMyProfile, b as useCustomerOrders, h as useCustomerReservations, a as useMenuItems, o as useUpdateProfile, D as DietaryTag, g as useCancelReservation, p as useRemoveFavorite } from "./useQueries-O8-RsMEM.js";
import { S as StatusBadge } from "./StatusBadge-BQTNwiKg.js";
import { P as Pen } from "./pen-BVerxw_X.js";
import { R as RotateCcw } from "./rotate-ccw-DGuBJnKN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
const DIETARY_OPTIONS = [
  { tag: DietaryTag.vegan, label: "Vegan", emoji: "🌿" },
  { tag: DietaryTag.vegetarian, label: "Vegetarian", emoji: "🥦" },
  { tag: DietaryTag.glutenFree, label: "Gluten-Free", emoji: "🌾" },
  { tag: DietaryTag.spicy, label: "Spicy Lover", emoji: "🌶️" }
];
const ACTIVE_ORDER_STATUSES = /* @__PURE__ */ new Set([
  "pending",
  "confirmed",
  "preparing",
  "ready"
]);
function LoginGate() {
  const { login } = useInternetIdentity();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      className: "flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center",
      "data-ocid": "account.sign_in_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center shadow-gold-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-9 h-9 text-accent-gold" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl italic text-foreground mb-3", children: [
            "Your ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "Dining Concierge" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body max-w-md leading-relaxed", children: "Sign in with Internet Identity to access your profile, track orders, manage reservations, and save your favourite dishes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "account.sign_in_button",
            onClick: () => login(),
            className: "gap-2 px-8 py-5 text-base font-body gradient-gold-accent text-primary-foreground hover:opacity-90 transition-smooth rounded-xl shadow-gold-glow border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-5 h-5" }),
              "Sign In with Internet Identity"
            ]
          }
        )
      ]
    }
  );
}
function AvatarInitials({ name }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full gradient-gold-accent flex items-center justify-center shadow-gold-glow flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl text-primary-foreground", children: initials || "YC" }) });
}
function ProfileCard({
  name,
  phone,
  email,
  dietaryPreferences,
  onSave,
  isSaving
}) {
  const [editing, setEditing] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({ name, phone, email });
  const [selectedDietary, setSelectedDietary] = reactExports.useState(dietaryPreferences);
  function toggleDietary(tag) {
    setSelectedDietary(
      (prev) => prev.includes(tag) ? prev.filter((d) => d !== tag) : [...prev, tag]
    );
  }
  function handleSubmit(e) {
    e.preventDefault();
    onSave({ ...form, dietaryPreferences: selectedDietary });
    setEditing(false);
  }
  function startEditing() {
    setForm({ name, phone, email });
    setSelectedDietary(dietaryPreferences);
    setEditing(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-2xl shadow-elevated overflow-hidden",
      "data-ocid": "account.profile_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 gradient-gold-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-5 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarInitials, { name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl italic text-foreground truncate", children: name || "Valued Guest" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-0.5", children: "Dining Concierge Member" })
              ] }),
              !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "account.edit_button",
                  variant: "outline",
                  size: "sm",
                  onClick: startEditing,
                  className: "gap-1.5 border-border hover:border-primary/50 transition-smooth flex-shrink-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" }),
                    "Edit"
                  ]
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.form,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              transition: { duration: 0.2 },
              onSubmit: handleSubmit,
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "acc-name",
                        className: "text-sm text-muted-foreground font-body",
                        children: "Full Name"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "acc-name",
                        "data-ocid": "account.name_input",
                        value: form.name,
                        onChange: (e) => setForm({ ...form, name: e.target.value }),
                        className: "bg-background border-border focus:border-primary/60 font-body",
                        placeholder: "Your full name"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "acc-phone",
                        className: "text-sm text-muted-foreground font-body",
                        children: "Phone"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "acc-phone",
                        type: "tel",
                        "data-ocid": "account.phone_input",
                        value: form.phone,
                        onChange: (e) => setForm({ ...form, phone: e.target.value }),
                        className: "bg-background border-border focus:border-primary/60 font-body",
                        placeholder: "+1 (555) 000-0000"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:col-span-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "acc-email",
                        className: "text-sm text-muted-foreground font-body",
                        children: "Email"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "acc-email",
                        type: "email",
                        "data-ocid": "account.email_input",
                        value: form.email,
                        onChange: (e) => setForm({ ...form, email: e.target.value }),
                        className: "bg-background border-border focus:border-primary/60 font-body",
                        placeholder: "your@email.com"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-muted-foreground font-body", children: "Dietary Preferences" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: DIETARY_OPTIONS.map((opt) => {
                    const active = selectedDietary.includes(opt.tag);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": `account.dietary_${opt.tag}`,
                        onClick: () => toggleDietary(opt.tag),
                        className: `px-4 py-1.5 rounded-full text-sm font-body border transition-smooth flex items-center gap-1.5 ${active ? "border-primary/60 bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/30"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: opt.emoji }),
                          opt.label
                        ]
                      },
                      opt.tag
                    );
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "submit",
                      "data-ocid": "account.save_button",
                      disabled: isSaving,
                      className: "gap-2 gradient-gold-accent text-primary-foreground hover:opacity-90 transition-smooth border-0",
                      children: [
                        isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                        "Save Changes"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      "data-ocid": "account.cancel_button",
                      onClick: () => setEditing(false),
                      className: "gap-2 border-border hover:border-primary/40 transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }),
                        "Cancel"
                      ]
                    }
                  )
                ] })
              ]
            },
            "edit"
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
              transition: { duration: 0.2 },
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
                  { label: "Phone", value: phone || "Not provided" },
                  { label: "Email", value: email || "Not provided" }
                ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "bg-background/60 rounded-xl px-4 py-3 border border-border",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-0.5", children: field.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-body truncate", children: field.value })
                    ]
                  },
                  field.label
                )) }),
                dietaryPreferences.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mb-2", children: "Dietary Preferences" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: dietaryPreferences.map((tag) => {
                    const opt = DIETARY_OPTIONS.find((o) => o.tag === tag);
                    return opt ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "px-3 py-1 rounded-full text-xs font-body border border-primary/40 bg-primary/10 text-foreground flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: opt.emoji }),
                          " ",
                          opt.label
                        ]
                      },
                      tag
                    ) : null;
                  }) })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body italic", children: "No dietary preferences set — click Edit to personalise your experience." })
              ]
            },
            "view"
          ) })
        ] })
      ]
    }
  );
}
function OrdersTab({ orders }) {
  const addItem = useCartStore((s) => s.addItem);
  const { data: menuItems } = useMenuItems();
  const navigate = useNavigate();
  function handleReorder(order) {
    if (!menuItems) return;
    let addedCount = 0;
    for (const oi of order.items) {
      const item = menuItems.find((m) => m.id === oi.menuItemId);
      if (item) {
        addItem(item, Number(oi.quantity));
        addedCount++;
      }
    }
    if (addedCount > 0) {
      ue.success("Items added to cart", {
        description: `${addedCount} item(s) added — head to checkout when ready.`
      });
      navigate({ to: "/order" });
    } else {
      ue.error("Could not reorder — items may no longer be available.");
    }
  }
  if (orders.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "account.orders.empty_state",
        className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-7 h-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-medium", children: "No orders yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-1", children: "Your order history will appear here after your first visit." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => navigate({ to: "/menu" }),
              className: "border-border hover:border-primary/50 transition-smooth mt-2",
              children: "Browse the Menu"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.map((order, idx) => {
    const isActive = ACTIVE_ORDER_STATUSES.has(order.status);
    const date = new Date(Number(order.createdAt) / 1e6);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        "data-ocid": `account.orders.item.${idx + 1}`,
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: idx * 0.05 },
        className: "bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-primary/30 transition-smooth",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
                "#",
                order.id.toString().padStart(4, "0")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status }),
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse",
                  "aria-label": "Active order"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body", children: [
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              }),
              " ",
              "· ",
              order.items.length,
              " item",
              order.items.length !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PriceDisplay,
            {
              cents: order.total,
              className: "text-sm font-body font-medium text-accent-gold"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0", children: [
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                "data-ocid": `account.orders.chat.${idx + 1}`,
                onClick: () => navigate({
                  to: "/chat/$orderId",
                  params: { orderId: order.id.toString() }
                }),
                className: "gap-1.5 border-border hover:border-primary/50 text-xs transition-smooth",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Chef" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                "data-ocid": `account.orders.reorder.${idx + 1}`,
                onClick: () => handleReorder(order),
                className: "gap-1.5 border-border hover:border-primary/50 text-xs transition-smooth",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Reorder" })
                ]
              }
            )
          ] })
        ]
      },
      order.id.toString()
    );
  }) });
}
function ReservationsTab({
  reservations
}) {
  const cancelReservation = useCancelReservation();
  const navigate = useNavigate();
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  function handleCancel(id) {
    cancelReservation.mutate(id, {
      onSuccess: () => ue.success("Reservation cancelled", {
        description: "We hope to welcome you again soon — book a new table anytime."
      }),
      onError: () => ue.error("Could not cancel reservation")
    });
  }
  if (reservations.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "account.reservations.empty_state",
        className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-7 h-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-medium", children: "No reservations yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-1", children: "Book a table and your reservations will appear here." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => navigate({ to: "/reservations" }),
              className: "border-border hover:border-primary/50 transition-smooth mt-2",
              children: "Reserve a Table"
            }
          )
        ]
      }
    );
  }
  const sorted = [...reservations].sort((a, b) => a.date > b.date ? -1 : 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: sorted.map((res, idx) => {
    const upcoming = res.status !== "cancelled" && res.date >= today;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        "data-ocid": `account.reservations.item.${idx + 1}`,
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: idx * 0.05 },
        className: "bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-primary/30 transition-smooth",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-background border border-border flex-shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-5 h-5 text-accent-gold" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: (/* @__PURE__ */ new Date(`${res.date}T00:00:00`)).toLocaleDateString(
                "en-US",
                {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: res.time }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: res.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body truncate", children: [
              "Table ",
              res.tableId.toString(),
              " · ",
              res.guestCount.toString(),
              " ",
              "guest",
              res.guestCount !== 1n ? "s" : "",
              res.specialOccasion ? ` · ${res.specialOccasion}` : ""
            ] })
          ] }),
          upcoming && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              "data-ocid": `account.reservations.cancel.${idx + 1}`,
              onClick: () => handleCancel(res.id),
              disabled: cancelReservation.isPending,
              className: "gap-1.5 border-border hover:border-destructive/50 hover:text-destructive text-xs flex-shrink-0 transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Cancel" })
              ]
            }
          )
        ]
      },
      res.id.toString()
    );
  }) });
}
function FavoritesTab({
  favoriteIds,
  allItems
}) {
  const addToCart = useCartStore((s) => s.addItem);
  const removeFavorite = useRemoveFavorite();
  const favorites = allItems.filter(
    (item) => favoriteIds.some((fid) => fid === item.id)
  );
  if (favorites.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "account.favorites.empty_state",
        className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-7 h-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-medium", children: "No favourites saved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-1", children: "Tap the heart on any dish to save it here for quick access." })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: favorites.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      "data-ocid": `account.favorites.item.${idx + 1}`,
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { delay: idx * 0.05 },
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth group shadow-luxury-sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-40 overflow-hidden bg-muted", children: [
          item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: item.imageUrl,
              alt: item.name,
              className: "w-full h-full object-cover group-hover:scale-105 transition-smooth"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "w-10 h-10 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `account.favorites.remove.${idx + 1}`,
              onClick: () => removeFavorite.mutate(item.id),
              "aria-label": "Remove from favourites",
              className: "absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:border-destructive/50 hover:text-destructive transition-smooth",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4 fill-primary text-primary" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display italic text-base text-foreground mb-1 truncate", children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body line-clamp-2 mb-3", children: item.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PriceDisplay,
              {
                cents: item.price,
                className: "text-sm font-body font-medium text-accent-gold"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                "data-ocid": `account.favorites.add_to_cart.${idx + 1}`,
                onClick: () => {
                  addToCart(item);
                  ue.success(`${item.name} added to cart`);
                },
                className: "gap-1.5 gradient-gold-accent text-primary-foreground hover:opacity-90 transition-smooth text-xs border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-3.5 h-3.5" }),
                  "Add to Cart"
                ]
              }
            )
          ] })
        ] })
      ]
    },
    item.id.toString()
  )) });
}
function SignOutButton() {
  const { clear } = useInternetIdentity();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": "account.signout_button",
      onClick: () => clear(),
      className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body transition-smooth group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-destructive/40 group-hover:text-destructive transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-3 h-3 rotate-180" }) }),
        "Sign Out"
      ]
    }
  );
}
function AccountPage() {
  const { isAuthenticated } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: rawOrders = [], isLoading: ordersLoading } = useCustomerOrders();
  const { data: rawReservations = [], isLoading: resLoading } = useCustomerReservations();
  const { data: allItems = [] } = useMenuItems();
  const updateProfile = useUpdateProfile();
  const [activeTab, setActiveTab] = reactExports.useState("orders");
  if (!isAuthenticated) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginGate, {});
  if (profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[50vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading your profile…" }) });
  }
  const orders = rawOrders;
  const reservations = rawReservations;
  const items = allItems;
  const currentProfile = profile ?? {
    name: "",
    phone: "",
    email: "",
    dietaryPreferences: [],
    favoriteItems: []
  };
  function handleProfileSave(data) {
    updateProfile.mutate(data, {
      onSuccess: () => ue.success("Profile saved", {
        description: "Your dining concierge profile has been updated."
      }),
      onError: () => ue.error("Failed to save profile — please try again.")
    });
  }
  const TABS = [
    {
      id: "orders",
      label: "Orders",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-4 h-4" }),
      count: orders.length
    },
    {
      id: "reservations",
      label: "Reservations",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4" }),
      count: reservations.length
    },
    {
      id: "favorites",
      label: "Favourites",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4" }),
      count: currentProfile.favoriteItems.length
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 section-divider" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display italic text-lg text-muted-foreground px-2 flex-shrink-0", children: "My Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 section-divider" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.05 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProfileCard,
          {
            name: currentProfile.name,
            phone: currentProfile.phone,
            email: currentProfile.email,
            dietaryPreferences: currentProfile.dietaryPreferences,
            onSave: handleProfileSave,
            isSaving: updateProfile.isPending
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        className: "space-y-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "account.tabs",
              className: "flex gap-1 bg-card border border-border rounded-xl p-1",
              children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `account.tab.${tab.id}`,
                  onClick: () => setActiveTab(tab.id),
                  className: `flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-body transition-smooth ${activeTab === tab.id ? "gradient-gold-accent text-primary-foreground shadow-subtle" : "text-muted-foreground hover:text-foreground"}`,
                  children: [
                    tab.icon,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: tab.label }),
                    tab.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${activeTab === tab.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`,
                        children: tab.count
                      }
                    )
                  ]
                },
                tab.id
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[320px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: 16 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -16 },
              transition: { duration: 0.2 },
              children: [
                activeTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "account.orders.panel", children: ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "account.orders.loading_state",
                    className: "flex items-center justify-center py-20",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading orders…" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersTab, { orders }) }),
                activeTab === "reservations" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "account.reservations.panel", children: resLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "account.reservations.loading_state",
                    className: "flex items-center justify-center py-20",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading reservations…" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ReservationsTab, { reservations }) }),
                activeTab === "favorites" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "account.favorites.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FavoritesTab,
                  {
                    favoriteIds: currentProfile.favoriteItems,
                    allItems: items
                  }
                ) })
              ]
            },
            activeTab
          ) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.2 },
        className: "flex justify-end pt-2 border-t border-border/40",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SignOutButton, {})
      }
    )
  ] });
}
export {
  AccountPage as default
};
