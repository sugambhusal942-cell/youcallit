import { q as jsxRuntimeExports, t as motion, U as UtensilsCrossed } from "./index-BMSJKAYU.js";
import { S as SenderRole } from "./useQueries-O8-RsMEM.js";
function formatTime(ts) {
  const ms = Number(ts / 1000000n);
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function ChatBubble({
  message,
  isCustomer,
  isNew = false
}) {
  const isChef = message.senderRole === SenderRole.chef;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: isNew ? { opacity: 0, y: 24, scale: 0.95 } : false,
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { type: "spring", stiffness: 340, damping: 30 },
      className: `flex items-end gap-3 ${isChef ? "justify-start" : "justify-end"}`,
      "data-ocid": `chat.bubble.${isChef ? "chef" : "customer"}`,
      children: [
        isChef && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-primary/15 border border-primary/30 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex flex-col gap-1 max-w-[72%] ${isChef ? "items-start" : "items-end"}`,
            children: [
              isChef && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-primary/80 pl-1 tracking-wide uppercase font-body", children: "Chef Alexandre" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `
            relative px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isChef ? "rounded-bl-sm bg-card/60 backdrop-blur-md border border-primary/20 shadow-lg text-foreground" : "rounded-br-sm bg-primary text-primary-foreground shadow-md"}
          `,
                  style: isChef ? {
                    background: "oklch(0.16 0.02 50 / 0.7)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)"
                  } : void 0,
                  children: [
                    isChef && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute inset-0 rounded-2xl rounded-bl-sm pointer-events-none",
                        style: {
                          background: "linear-gradient(135deg, oklch(0.68 0.18 65 / 0.07) 0%, transparent 60%)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative z-10 whitespace-pre-wrap break-words", children: message.content })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground px-1", children: formatTime(message.timestamp) })
            ]
          }
        ),
        !isChef && isCustomer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 self-end mb-5", children: message.isRead ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-[10px]", children: "✓✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: "✓" }) })
      ]
    }
  );
}
export {
  ChatBubble as C
};
