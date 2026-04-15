import { c as createLucideIcon, j as reactExports, q as jsxRuntimeExports, t as motion, U as UtensilsCrossed, I as ShoppingBag, A as AnimatePresence, B as Button, P as PriceDisplay, J as Separator, L as Link, w as MessageCircle, K as useInternetIdentity, x as useCartStore, N as ScrollArea, G as Minus, z as Plus, Q as Trash2, V as PageLoader, y as Badge, H as ue } from "./index-BMSJKAYU.js";
import { O as OrderType, b as useCustomerOrders, a as useMenuItems, c as usePlaceOrder, d as useCancelOrder } from "./useQueries-O8-RsMEM.js";
import { I as Input } from "./input-Bh-soQlE.js";
import { L as Label } from "./label--nLC03EJ.js";
import { T as Textarea } from "./textarea-ISgui2tl.js";
import { C as Clock } from "./clock-C2oBtNq8.js";
import { C as ChevronRight, a as CircleCheck } from "./circle-check-DfNiECus.js";
import { R as RotateCcw } from "./rotate-ccw-DGuBJnKN.js";
import { S as StatusBadge } from "./StatusBadge-BQTNwiKg.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
function validate(data) {
  const errors = {};
  if (data.orderType === OrderType.dineIn && !data.tableNumber.trim()) {
    errors.tableNumber = "Table number is required for dine-in.";
  }
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\+?[\d\s\-().]{7,15}$/.test(data.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
}
function CheckoutForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = reactExports.useState({
    orderType: OrderType.dineIn,
    tableNumber: "",
    name: "",
    phone: "",
    email: "",
    specialInstructions: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
  const estimatedWait = formData.orderType === OrderType.dineIn ? "20–30 min" : "15–20 min";
  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    const newErrors = validate({ ...formData });
    setErrors(newErrors);
  }
  function set(key, value) {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    if (touched[key]) {
      setErrors(validate(updated));
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    await onSubmit(formData);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-8",
      "data-ocid": "checkout.form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs uppercase tracking-widest mb-3 block", children: "Order Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid grid-cols-2 gap-0 bg-muted rounded-xl p-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "absolute inset-y-1 rounded-lg bg-primary shadow-subtle pointer-events-none",
                style: { width: "calc(50% - 4px)" },
                animate: {
                  x: formData.orderType === OrderType.dineIn ? 4 : "calc(100% + 4px)"
                },
                transition: { type: "spring", stiffness: 400, damping: 30 }
              }
            ),
            [
              {
                type: OrderType.dineIn,
                label: "Dine In",
                icon: UtensilsCrossed
              },
              { type: OrderType.takeout, label: "Takeout", icon: ShoppingBag }
            ].map(({ type, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => set("orderType", type),
                className: `relative z-10 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-smooth ${formData.orderType === type ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `checkout.order_type_${type}_toggle`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
                  label
                ]
              },
              type
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            layout: true,
            className: "flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-3 border border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Estimated wait time:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: estimatedWait })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: formData.orderType === OrderType.dineIn && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.25 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "tableNumber",
                  className: "text-sm text-muted-foreground",
                  children: [
                    "Table Number ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "tableNumber",
                  placeholder: "e.g. 12",
                  value: formData.tableNumber,
                  onChange: (e) => set("tableNumber", e.target.value),
                  onBlur: () => handleBlur("tableNumber"),
                  className: "bg-muted border-input focus:border-primary",
                  "data-ocid": "checkout.table_number_input"
                }
              ),
              touched.tableNumber && errors.tableNumber && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-destructive text-xs mt-1",
                  "data-ocid": "checkout.table_number_error",
                  children: errors.tableNumber
                }
              )
            ] })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "name", className: "text-sm text-muted-foreground", children: [
            "Full Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              placeholder: "Alexandre Dubois",
              value: formData.name,
              onChange: (e) => set("name", e.target.value),
              onBlur: () => handleBlur("name"),
              className: "bg-muted border-input focus:border-primary",
              "data-ocid": "checkout.name_input"
            }
          ),
          touched.name && errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-destructive text-xs mt-1",
              "data-ocid": "checkout.name_error",
              children: errors.name
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "phone", className: "text-sm text-muted-foreground", children: [
              "Phone ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "phone",
                type: "tel",
                placeholder: "+1 (555) 000-0000",
                value: formData.phone,
                onChange: (e) => set("phone", e.target.value),
                onBlur: () => handleBlur("phone"),
                className: "bg-muted border-input focus:border-primary",
                "data-ocid": "checkout.phone_input"
              }
            ),
            touched.phone && errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-destructive text-xs mt-1",
                "data-ocid": "checkout.phone_error",
                children: errors.phone
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "email", className: "text-sm text-muted-foreground", children: [
              "Email ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "email",
                type: "email",
                placeholder: "you@example.com",
                value: formData.email,
                onChange: (e) => set("email", e.target.value),
                onBlur: () => handleBlur("email"),
                className: "bg-muted border-input focus:border-primary",
                "data-ocid": "checkout.email_input"
              }
            ),
            touched.email && errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-destructive text-xs mt-1",
                "data-ocid": "checkout.email_error",
                children: errors.email
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "special", className: "text-sm text-muted-foreground", children: [
            "Special Instructions",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 text-xs", children: "(optional)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "special",
              placeholder: "Allergies, dietary requirements, preferences...",
              value: formData.specialInstructions,
              onChange: (e) => set("specialInstructions", e.target.value),
              rows: 3,
              className: "bg-muted border-input focus:border-primary resize-none",
              "data-ocid": "checkout.instructions_textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: "w-full py-6 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-smooth flex items-center justify-center gap-2",
            "data-ocid": "checkout.place_order_button",
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                LoaderCircle,
                {
                  className: "w-5 h-5 animate-spin",
                  "data-ocid": "checkout.loading_state"
                }
              ),
              "Placing your order…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Place Order",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" })
            ] })
          }
        )
      ]
    }
  );
}
function AnimatedCheck() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "relative w-24 h-24 mx-auto",
      initial: { scale: 0 },
      animate: { scale: 1 },
      transition: { type: "spring", stiffness: 280, damping: 20, delay: 0.1 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute inset-0 rounded-full bg-primary/20",
            initial: { scale: 0.5, opacity: 0 },
            animate: { scale: 1.3, opacity: 0 },
            transition: {
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
              delay: 0.6
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-primary/15 border-2 border-primary/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            viewBox: "0 0 52 52",
            className: "w-12 h-12",
            fill: "none",
            stroke: "currentColor",
            "aria-label": "Order confirmed checkmark",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Order confirmed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.circle,
                {
                  cx: "26",
                  cy: "26",
                  r: "23",
                  className: "stroke-primary",
                  strokeWidth: "2",
                  strokeDasharray: 145,
                  initial: { strokeDashoffset: 145 },
                  animate: { strokeDashoffset: 0 },
                  transition: { duration: 0.6, ease: "easeOut", delay: 0.2 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.path,
                {
                  d: "M14 26 l8 8 l16 -16",
                  className: "stroke-primary",
                  strokeWidth: "3",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeDasharray: 40,
                  strokeDashoffset: 40,
                  animate: { strokeDashoffset: 0 },
                  transition: { duration: 0.45, ease: "easeOut", delay: 0.7 }
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
function OrderConfirmation({
  order,
  menuItems,
  onOrderAgain
}) {
  const menuMap = new Map(menuItems.map((m) => [m.id.toString(), m]));
  const isInDine = order.orderType === "dineIn";
  const estimatedTime = isInDine ? "20–30 min" : "15–20 min";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 32 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      className: "max-w-lg mx-auto px-4 py-12 space-y-8",
      "data-ocid": "order_confirmation.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCheck, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "text-center space-y-2",
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground", children: "Order Confirmed!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Thank you for dining with youCallIT. Your order is being prepared." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "bg-card border border-border rounded-2xl overflow-hidden",
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.6 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 divide-x divide-border", children: [
              { label: "Order ID", value: `#${order.id.toString()}` },
              { label: "Type", value: isInDine ? "Dine In" : "Takeout" },
              {
                label: "Est. Wait",
                value: estimatedTime,
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 inline mr-1 text-primary" })
              }
            ].map(({ label, value, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-1", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground min-w-0 truncate", children: [
                icon,
                value
              ] })
            ] }, label)) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "bg-card border border-border rounded-2xl",
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.7 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground uppercase tracking-wider", children: "Order Summary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "ul",
                {
                  className: "divide-y divide-border",
                  "data-ocid": "order_confirmation.items_list",
                  children: order.items.map((item) => {
                    const menuItem = menuMap.get(item.menuItemId.toString());
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        className: "flex items-center gap-3 px-5 py-3",
                        "data-ocid": `order_confirmation.item.${item.menuItemId.toString()}`,
                        children: [
                          (menuItem == null ? void 0 : menuItem.imageUrl) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: menuItem.imageUrl,
                              alt: menuItem == null ? void 0 : menuItem.name,
                              className: "w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: (menuItem == null ? void 0 : menuItem.name) ?? `Item #${item.menuItemId.toString()}` }),
                            item.specialInstructions && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: item.specialInstructions })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
                              "×",
                              item.quantity.toString()
                            ] }),
                            menuItem && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              PriceDisplay,
                              {
                                cents: BigInt(
                                  Number(menuItem.price) * Number(item.quantity)
                                ),
                                className: "text-sm font-semibold text-foreground"
                              }
                            )
                          ] })
                        ]
                      },
                      item.menuItemId.toString()
                    );
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 space-y-1.5 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { cents: order.subtotal })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tax" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { cents: order.tax })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold text-base text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { cents: order.total }) })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "flex flex-col sm:flex-row gap-3",
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.85 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/chat/$orderId",
                  params: { orderId: order.id.toString() },
                  className: "flex-1",
                  "data-ocid": "order_confirmation.chat_chef_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "default",
                      className: "w-full py-5 bg-primary text-primary-foreground hover:opacity-90 transition-smooth flex items-center gap-2 font-semibold",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5" }),
                        "Chat with Chef"
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "flex-1 py-5 border-border hover:border-primary transition-smooth flex items-center gap-2",
                  onClick: onOrderAgain,
                  "data-ocid": "order_confirmation.order_again_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
                    "Order Again"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.p,
          {
            className: "text-center text-xs text-muted-foreground",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 1 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 inline mr-1 text-primary" }),
              "We'll notify you as soon as your order status changes."
            ]
          }
        )
      ]
    }
  );
}
const TAX_RATE = 0.08;
function OrderPage() {
  const { login, isAuthenticated } = useInternetIdentity();
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const [confirmedOrder, setConfirmedOrder] = reactExports.useState(null);
  const { data: orders, isLoading: ordersLoading } = useCustomerOrders();
  const { data: menuItems = [] } = useMenuItems();
  const placeOrder = usePlaceOrder();
  const cancelOrder = useCancelOrder();
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  async function handleCheckoutSubmit(data) {
    if (!isAuthenticated) {
      ue.error("Please sign in to place an order.");
      login();
      return;
    }
    const orderItems = items.map((ci) => ({
      menuItemId: ci.menuItem.id,
      quantity: BigInt(ci.quantity),
      specialInstructions: ci.specialInstructions
    }));
    const tableNum = data.orderType === OrderType.dineIn && data.tableNumber ? BigInt(Number.parseInt(data.tableNumber, 10)) : null;
    try {
      const result = await placeOrder.mutateAsync({
        items: orderItems,
        orderType: data.orderType,
        specialInstructions: data.specialInstructions,
        tableNumber: tableNum
      });
      clearCart();
      setConfirmedOrder(result);
    } catch {
      ue.error("Failed to place order. Please try again.");
    }
  }
  if (confirmedOrder) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrderConfirmation,
      {
        order: confirmedOrder,
        menuItems,
        onOrderAgain: () => setConfirmedOrder(null)
      }
    ) });
  }
  if (items.length === 0 && (!orders || orders.length === 0) && !ordersLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4",
        "data-ocid": "order.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { type: "spring", stiffness: 260, damping: 22 },
              className: "w-32 h-32 rounded-full bg-muted border border-border flex items-center justify-center shadow-luxury",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  animate: { rotate: [0, -4, 4, -4, 4, 0] },
                  transition: {
                    duration: 2.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3.5
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-14 h-14 text-muted-foreground/30" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "text-center space-y-2",
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display italic text-3xl text-foreground", children: "Your cart is empty" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm text-sm", children: "Explore our curated menu and add your favourite dishes to begin your order." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.35 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "gradient-gold-accent border-0 text-primary-foreground hover:opacity-90 transition-smooth px-8 py-5 text-base font-semibold shadow-gold-glow",
                  "data-ocid": "order.browse_menu_button",
                  children: "Explore the Menu"
                }
              ) })
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen bg-background py-10 px-4",
      "data-ocid": "order.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            className: "mb-10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body font-semibold tracking-widest uppercase text-primary mb-2", children: "Checkout" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display italic text-4xl md:text-5xl text-foreground", children: [
                "Your ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "Order" })
              ] })
            ]
          }
        ),
        items.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden",
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.08 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-border flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-body font-semibold text-foreground flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 text-primary" }),
                    "Cart (",
                    items.reduce((s, i) => s + i.quantity, 0),
                    " items)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/menu",
                      className: "text-primary text-xs hover:opacity-70 transition-smooth",
                      children: "+ Add more"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "ul",
                  {
                    className: "divide-y divide-border",
                    "data-ocid": "order.items_list",
                    children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.li,
                      {
                        layout: true,
                        initial: { opacity: 0, x: -14 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: i * 0.05 },
                        className: "flex items-center gap-4 px-6 py-4",
                        "data-ocid": `order.item.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted", children: item.menuItem.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: item.menuItem.imageUrl,
                              alt: item.menuItem.name,
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-lg", children: "🍽️" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-semibold text-foreground text-sm truncate", children: item.menuItem.name }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              PriceDisplay,
                              {
                                cents: item.menuItem.price,
                                className: "text-primary text-xs font-body"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                className: "w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth",
                                onClick: () => updateQuantity(item.menuItem.id, item.quantity - 1),
                                "data-ocid": `order.decrease_button.${i + 1}`,
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 text-center text-sm font-body", children: item.quantity }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                className: "w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth",
                                onClick: () => updateQuantity(item.menuItem.id, item.quantity + 1),
                                "data-ocid": `order.increase_button.${i + 1}`,
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                className: "w-7 h-7 flex items-center justify-center hover:text-destructive transition-smooth ml-1",
                                onClick: () => removeItem(item.menuItem.id),
                                "data-ocid": `order.remove_button.${i + 1}`,
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-muted-foreground hover:text-destructive transition-smooth" })
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 text-right flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            PriceDisplay,
                            {
                              cents: BigInt(
                                Math.round(
                                  Number(item.menuItem.price) * item.quantity
                                )
                              ),
                              className: "text-sm font-semibold text-foreground"
                            }
                          ) })
                        ]
                      },
                      item.menuItem.id.toString()
                    ))
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-6 py-5 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { cents: subtotal, className: "text-foreground" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tax (8%)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { cents: tax, className: "text-foreground" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold text-base", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { cents: total, className: "text-primary" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              className: "lg:col-span-2 bg-card border border-border rounded-2xl p-6",
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.12 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-body font-semibold text-foreground text-lg mb-6", children: "Order Details" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CheckoutForm,
                  {
                    cartItems: items,
                    onSubmit: handleCheckoutSubmit,
                    isSubmitting: placeOrder.isPending
                  }
                )
              ]
            }
          )
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-body font-semibold text-foreground text-xl mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-primary" }),
            "Order History"
          ] }),
          ordersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {}) : !orders || orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-card border border-border rounded-2xl p-8 text-center",
              "data-ocid": "order.history_empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "No orders yet. Start by exploring our menu!" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "order.history_list", children: orders.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.06 },
              className: "bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4",
              "data-ocid": `order.history_item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-body text-muted-foreground", children: [
                      "Order #",
                      order.id.toString()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs font-body border-border/30 text-muted-foreground",
                        children: order.orderType === "dineIn" ? "Dine In" : "Takeout"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-body text-foreground", children: [
                    order.items.length,
                    " ",
                    order.items.length === 1 ? "item" : "items"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: new Date(
                    Number(order.createdAt) / 1e6
                  ).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PriceDisplay,
                    {
                      cents: order.total,
                      className: "text-primary font-body font-semibold"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/chat/$orderId",
                        params: { orderId: order.id.toString() },
                        "data-ocid": `order.chat_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "icon",
                            className: "hover:bg-primary/10 hover:text-primary transition-smooth",
                            title: "Chat with chef",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" })
                          }
                        )
                      }
                    ),
                    (order.status === "pending" || order.status === "confirmed") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        className: "text-xs hover:bg-destructive/15 hover:text-destructive transition-smooth font-body",
                        onClick: () => cancelOrder.mutate(order.id),
                        "data-ocid": `order.cancel_button.${i + 1}`,
                        children: "Cancel"
                      }
                    )
                  ] })
                ] })
              ]
            },
            order.id.toString()
          )) })
        ] })
      ] })
    }
  );
}
export {
  OrderPage as default
};
