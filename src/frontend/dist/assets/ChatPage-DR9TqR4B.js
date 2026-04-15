import { c as createLucideIcon, j as reactExports, q as jsxRuntimeExports, t as motion, Z as useParams, L as Link, U as UtensilsCrossed, I as ShoppingBag, A as AnimatePresence, H as ue, w as MessageCircle } from "./index-BMSJKAYU.js";
import { S as Skeleton } from "./skeleton-Cy9m2DLt.js";
import { i as useThread, j as useOrder, k as useSendMessage, l as useActor, S as SenderRole, m as OrderStatus } from "./useQueries-O8-RsMEM.js";
import { C as ChatBubble } from "./ChatBubble-8SxLXA60.js";
import { C as ChevronLeft } from "./chevron-left-D-1ivN8J.js";
import { C as Clock } from "./clock-C2oBtNq8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$1);
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
      d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",
      key: "117uat"
    }
  ],
  ["path", { d: "M6 12h16", key: "s4cdu5" }]
];
const SendHorizontal = createLucideIcon("send-horizontal", __iconNode);
function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  placeholder
}) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  });
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  }
  const canSend = value.trim().length > 0 && !disabled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex items-end gap-3 bg-card/70 backdrop-blur border border-border/60 rounded-2xl px-4 py-3 shadow-lg transition-colors focus-within:border-primary/50",
      style: { backdropFilter: "blur(16px)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            ref,
            value,
            onChange: (e) => onChange(e.target.value),
            onKeyDown: handleKey,
            disabled,
            placeholder: placeholder ?? "Message your chef…",
            rows: 1,
            className: "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none outline-none leading-relaxed max-h-40 min-h-[24px] font-body disabled:opacity-50",
            "data-ocid": "chat.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            type: "button",
            onClick: () => canSend && onSend(),
            disabled: !canSend,
            whileHover: canSend ? { scale: 1.08 } : {},
            whileTap: canSend ? { scale: 0.92 } : {},
            className: `
          flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
          ${canSend ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:brightness-110 cursor-pointer" : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"}
        `,
            "aria-label": "Send message",
            "data-ocid": "chat.send_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: false,
                animate: canSend ? { rotate: 0 } : { rotate: -20 },
                transition: { type: "spring", stiffness: 400, damping: 20 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { className: "w-4 h-4" })
              },
              value
            )
          }
        )
      ]
    }
  );
}
const QUICK_REPLIES = [
  "No salt please",
  "Extra spicy 🌶️",
  "Sauce on the side",
  "Chef recommendation?",
  "Any allergens?",
  "Can I substitute this?"
];
const STATUS_COLORS = {
  [OrderStatus.pending]: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  [OrderStatus.confirmed]: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  [OrderStatus.preparing]: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  [OrderStatus.ready]: "bg-green-500/20 text-green-300 border-green-500/30",
  [OrderStatus.completed]: "bg-muted text-muted-foreground border-border",
  [OrderStatus.cancelled]: "bg-destructive/20 text-destructive border-destructive/30"
};
function ChatPage() {
  const { orderId } = useParams({ from: "/chat/$orderId" });
  const orderIdBig = BigInt(orderId);
  const { data: thread, isLoading: threadLoading } = useThread(orderIdBig);
  const { data: order } = useOrder(orderIdBig);
  const sendMessage = useSendMessage();
  const { actor } = useActor();
  const [input, setInput] = reactExports.useState("");
  const [localMessages, setLocalMessages] = reactExports.useState([]);
  const [newMessageIds, setNewMessageIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [isScrolledUp, setIsScrolledUp] = reactExports.useState(false);
  const [hasNewBelow, setHasNewBelow] = reactExports.useState(false);
  const initialized = reactExports.useRef(false);
  const lastMessageIdRef = reactExports.useRef(0n);
  const scrollRef = reactExports.useRef(null);
  const bottomRef = reactExports.useRef(null);
  const pollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if ((thread == null ? void 0 : thread.messages) && !initialized.current) {
      initialized.current = true;
      setLocalMessages(thread.messages);
      if (thread.messages.length > 0) {
        const maxId = thread.messages.reduce(
          (m, msg) => msg.id > m ? msg.id : m,
          0n
        );
        lastMessageIdRef.current = maxId;
      }
    }
  }, [thread == null ? void 0 : thread.messages]);
  const scrollToBottom = reactExports.useCallback((behavior = "smooth") => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior });
  }, []);
  const pollMessages = reactExports.useCallback(async () => {
    if (!actor || !(thread == null ? void 0 : thread.id)) return;
    try {
      const newMsgs = await actor.getNewMessages(
        thread.id,
        lastMessageIdRef.current
      );
      if (newMsgs.length > 0) {
        const ids = new Set(newMsgs.map((m) => m.id));
        setNewMessageIds(ids);
        setLocalMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const fresh = newMsgs.filter((m) => !existingIds.has(m.id));
          return [...prev, ...fresh];
        });
        const maxId = newMsgs.reduce(
          (m, msg) => msg.id > m ? msg.id : m,
          lastMessageIdRef.current
        );
        lastMessageIdRef.current = maxId;
        if (isScrolledUp) setHasNewBelow(true);
        else scrollToBottom("smooth");
      }
    } catch {
    }
  }, [actor, thread == null ? void 0 : thread.id, isScrolledUp, scrollToBottom]);
  reactExports.useEffect(() => {
    pollRef.current = setInterval(pollMessages, 2e3);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollMessages]);
  reactExports.useEffect(() => {
    if (localMessages.length > 0 && !isScrolledUp) {
      scrollToBottom("smooth");
    }
  }, [localMessages.length, isScrolledUp, scrollToBottom]);
  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const scrolledUp = distFromBottom > 80;
    setIsScrolledUp(scrolledUp);
    if (!scrolledUp) setHasNewBelow(false);
  }
  async function handleSend() {
    const content = input.trim();
    if (!content) return;
    setInput("");
    const tempId = BigInt(-Date.now());
    const optimistic = {
      id: tempId,
      content,
      isRead: false,
      orderId: orderIdBig,
      timestamp: BigInt(Date.now()) * 1000000n,
      senderRole: SenderRole.customer,
      senderId: {}
    };
    setLocalMessages((prev) => [...prev, optimistic]);
    setNewMessageIds(/* @__PURE__ */ new Set([tempId]));
    scrollToBottom("smooth");
    try {
      const sent = await sendMessage.mutateAsync({
        orderId: orderIdBig,
        content
      });
      setLocalMessages((prev) => prev.map((m) => m.id === tempId ? sent : m));
      lastMessageIdRef.current = sent.id;
    } catch {
      ue.error("Failed to send message. Please try again.");
      setLocalMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  }
  const statusLabel = (order == null ? void 0 : order.status) ? String(order.status).charAt(0).toUpperCase() + String(order.status).slice(1) : "Loading";
  const statusColor = order ? STATUS_COLORS[String(order.status)] ?? "" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden",
      "data-ocid": "chat.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-shrink-0 bg-card/90 border-b border-border/60 shadow-sm z-10",
            style: { backdropFilter: "blur(16px)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-3 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/order",
                  className: "flex-shrink-0 p-1.5 rounded-lg hover:bg-muted/60 transition-colors",
                  "data-ocid": "chat.back_link",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5 text-muted-foreground" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-5 h-5 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card",
                      "data-ocid": "chat.chef_online",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.span,
                        {
                          className: "block w-full h-full rounded-full bg-green-400",
                          animate: { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] },
                          transition: {
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut"
                          }
                        }
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-foreground text-sm leading-tight", children: "Chef Alexandre Dubois" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-400 font-medium", children: "Online — responds instantly" })
                ] })
              ] }),
              order && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1.5 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-3.5 h-3.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                    "#",
                    String(order.id)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    order.items.length,
                    " item",
                    order.items.length !== 1 ? "s" : ""
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColor}`,
                    "data-ocid": "chat.order_status",
                    children: statusLabel
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: scrollRef,
            onScroll: handleScroll,
            className: "flex-1 overflow-y-auto overscroll-contain",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4 min-h-full", children: [
              threadLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex flex-col gap-4 pt-4",
                  "data-ocid": "chat.loading_state",
                  children: ["a", "b", "c", "d"].map((k, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Skeleton,
                          {
                            className: `h-14 rounded-2xl ${i % 2 === 0 ? "w-64" : "w-48"}`
                          }
                        )
                      ]
                    },
                    k
                  ))
                }
              ) : localMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: localMessages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChatBubble,
                {
                  message: msg,
                  isCustomer: msg.senderRole === SenderRole.customer,
                  isNew: newMessageIds.has(msg.id)
                },
                msg.id.toString()
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef, className: "h-1" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hasNewBelow && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.button,
          {
            initial: { opacity: 0, y: 12, scale: 0.9 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 8, scale: 0.9 },
            onClick: () => {
              scrollToBottom("smooth");
              setHasNewBelow(false);
            },
            className: "absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-lg shadow-primary/30 hover:brightness-110 cursor-pointer transition-all",
            "data-ocid": "chat.new_message_indicator",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3.5 h-3.5" }),
              "New message"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-shrink-0 bg-background/90 border-t border-border/50 z-10",
            style: { backdropFilter: "blur(12px)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 pt-3 pb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex gap-2 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden",
                  "data-ocid": "chat.quick_replies",
                  children: QUICK_REPLIES.map((reply) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setInput(reply),
                      className: "flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 hover:border-primary/50 transition-all duration-150 font-body whitespace-nowrap cursor-pointer",
                      "data-ocid": "chat.quick_reply",
                      children: reply
                    },
                    reply
                  ))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChatInput,
                {
                  value: input,
                  onChange: setInput,
                  onSend: handleSend,
                  disabled: sendMessage.isPending,
                  placeholder: "Message your chef…"
                }
              )
            ] })
          }
        )
      ]
    }
  );
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex-1 flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "chat.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: { scale: [1, 1.08, 1], rotate: [0, -6, 6, 0] },
            transition: {
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut"
            },
            className: "w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-9 h-9 text-primary", strokeWidth: 1.5 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-foreground mb-2", children: "Start the Conversation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs leading-relaxed", children: "Your chef is ready. Ask about ingredients, request modifications, or share your preferences." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-4 py-2 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Usually responds within seconds" })
        ] })
      ]
    }
  );
}
export {
  ChatPage as default
};
