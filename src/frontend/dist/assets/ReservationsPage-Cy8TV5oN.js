import { c as createLucideIcon, q as jsxRuntimeExports, t as motion, W as ChefHat, y as Badge, Y as Calendar, L as Link, B as Button, w as MessageCircle, j as reactExports, A as AnimatePresence, G as Minus, z as Plus, H as ue } from "./index-BMSJKAYU.js";
import { S as Skeleton } from "./skeleton-Cy9m2DLt.js";
import { T as TableStatus, e as useAvailableTables, f as useMakeReservation, g as useCancelReservation, h as useCustomerReservations } from "./useQueries-O8-RsMEM.js";
import { a as CircleCheck, C as ChevronRight } from "./circle-check-DfNiECus.js";
import { C as Clock } from "./clock-C2oBtNq8.js";
import { U as Users, C as CircleX, a as Check } from "./users-BIIPmlv3.js";
import { I as Input } from "./input-Bh-soQlE.js";
import { L as Label } from "./label--nLC03EJ.js";
import { T as Textarea } from "./textarea-ISgui2tl.js";
import { C as ChevronLeft } from "./chevron-left-D-1ivN8J.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }]
];
const Table = createLucideIcon("table", __iconNode);
const STATUS_FILL = {
  [TableStatus.available]: "oklch(0.68 0.18 65 / 0.18)",
  [TableStatus.reserved]: "oklch(0.35 0.015 50 / 0.85)",
  [TableStatus.occupied]: "oklch(0.52 0.18 25 / 0.55)",
  [TableStatus.maintenance]: "oklch(0.28 0.01 50 / 0.7)"
};
const STATUS_STROKE = {
  [TableStatus.available]: "oklch(0.68 0.18 65 / 0.8)",
  [TableStatus.reserved]: "oklch(0.45 0.015 50 / 0.6)",
  [TableStatus.occupied]: "oklch(0.62 0.2 25 / 0.7)",
  [TableStatus.maintenance]: "oklch(0.38 0.01 50 / 0.5)"
};
const STATUS_LABEL = {
  [TableStatus.available]: "Available",
  [TableStatus.reserved]: "Reserved",
  [TableStatus.occupied]: "Occupied",
  [TableStatus.maintenance]: "Maintenance"
};
const TABLE_LAYOUT = [
  { x: 80, y: 120, w: 72, h: 56 },
  // Table 1 - left row
  { x: 80, y: 220, w: 72, h: 56 },
  // Table 2
  { x: 80, y: 320, w: 72, h: 56 },
  // Table 3
  { x: 200, y: 140, w: 88, h: 64 },
  // Table 4 - center
  { x: 200, y: 250, w: 88, h: 64 },
  // Table 5
  { x: 200, y: 360, w: 88, h: 64 },
  // Table 6
  { x: 340, y: 120, w: 72, h: 56 },
  // Table 7 - right
  { x: 340, y: 220, w: 72, h: 56 },
  // Table 8
  { x: 340, y: 320, w: 72, h: 56 },
  // Table 9
  { x: 460, y: 180, w: 88, h: 72 }
  // Table 10 - far right
];
function FloorPlan({
  tables,
  selectedTableId,
  onSelectTable
}) {
  const getLayout = (index) => TABLE_LAYOUT[index % TABLE_LAYOUT.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full overflow-x-auto",
      "data-ocid": "floorplan.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            viewBox: "0 0 600 480",
            className: "w-full max-w-2xl mx-auto h-auto",
            style: { filter: "drop-shadow(0 4px 24px oklch(0 0 0 / 0.5))" },
            role: "img",
            "aria-label": "Restaurant floor plan",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "pattern",
                  {
                    id: "floor-pattern",
                    x: "0",
                    y: "0",
                    width: "20",
                    height: "20",
                    patternUnits: "userSpaceOnUse",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "20", height: "20", fill: "oklch(0.14 0.015 50)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M0 20L20 0M-5 5L5 -5M15 25L25 15",
                          stroke: "oklch(0.2 0.015 50)",
                          strokeWidth: "0.5"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "glow-gold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "coloredBlur" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: "selected-glow", cx: "50%", cy: "50%", r: "50%", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.68 0.18 65 / 0.4)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.68 0.18 65 / 0)" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "rect",
                {
                  x: "10",
                  y: "10",
                  width: "580",
                  height: "460",
                  rx: "12",
                  fill: "url(#floor-pattern)",
                  stroke: "oklch(0.25 0.02 50)",
                  strokeWidth: "1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "230",
                    y: "430",
                    width: "140",
                    height: "30",
                    rx: "6",
                    fill: "oklch(0.2 0.02 50 / 0.9)",
                    stroke: "oklch(0.68 0.18 65 / 0.3)",
                    strokeWidth: "1"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: "300",
                    y: "450",
                    textAnchor: "middle",
                    fill: "oklch(0.68 0.18 65 / 0.9)",
                    fontSize: "11",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "2",
                    children: "ENTRANCE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M300 420 L300 408 M295 413 L300 408 L305 413",
                  stroke: "oklch(0.68 0.18 65 / 0.4)",
                  strokeWidth: "1.5",
                  fill: "none",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "470",
                    y: "20",
                    width: "110",
                    height: "110",
                    rx: "8",
                    fill: "oklch(0.18 0.02 50 / 0.9)",
                    stroke: "oklch(0.68 0.18 65 / 0.25)",
                    strokeWidth: "1",
                    strokeDasharray: "4 2"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: "525",
                    y: "62",
                    textAnchor: "middle",
                    fill: "oklch(0.68 0.18 65 / 0.7)",
                    fontSize: "10",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "1.5",
                    children: "BAR"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: "525",
                    y: "76",
                    textAnchor: "middle",
                    fill: "oklch(0.68 0.18 65 / 0.7)",
                    fontSize: "10",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "1.5",
                    children: "LOUNGE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "478",
                    y: "86",
                    width: "94",
                    height: "10",
                    rx: "4",
                    fill: "oklch(0.68 0.18 65 / 0.15)",
                    stroke: "oklch(0.68 0.18 65 / 0.3)",
                    strokeWidth: "0.5"
                  }
                ),
                [490, 508, 526, 544, 562].map((bx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: bx,
                    cy: "100",
                    r: "5",
                    fill: "oklch(0.22 0.02 50)",
                    stroke: "oklch(0.4 0.02 50)",
                    strokeWidth: "0.5"
                  },
                  bx
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "20",
                    y: "20",
                    width: "120",
                    height: "75",
                    rx: "8",
                    fill: "oklch(0.16 0.018 50 / 0.9)",
                    stroke: "oklch(0.55 0.015 65 / 0.2)",
                    strokeWidth: "1",
                    strokeDasharray: "4 2"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: "80",
                    y: "52",
                    textAnchor: "middle",
                    fill: "oklch(0.55 0.015 65 / 0.6)",
                    fontSize: "10",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "1.5",
                    children: "KITCHEN"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: "80",
                    y: "66",
                    textAnchor: "middle",
                    fill: "oklch(0.55 0.015 65 / 0.5)",
                    fontSize: "9",
                    fontFamily: "var(--font-body)",
                    children: "Staff Only"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "85",
                    y: "73",
                    width: "50",
                    height: "8",
                    rx: "2",
                    fill: "oklch(0.68 0.18 65 / 0.12)",
                    stroke: "oklch(0.68 0.18 65 / 0.25)",
                    strokeWidth: "0.5"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: "470",
                    y: "300",
                    width: "110",
                    height: "120",
                    rx: "8",
                    fill: "oklch(0.16 0.018 50 / 0.7)",
                    stroke: "oklch(0.55 0.015 65 / 0.15)",
                    strokeWidth: "1",
                    strokeDasharray: "4 2"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: "525",
                    y: "352",
                    textAnchor: "middle",
                    fill: "oklch(0.55 0.015 65 / 0.5)",
                    fontSize: "9",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "1.5",
                    children: "PRIVATE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: "525",
                    y: "366",
                    textAnchor: "middle",
                    fill: "oklch(0.55 0.015 65 / 0.5)",
                    fontSize: "9",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "1.5",
                    children: "DINING"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: "160",
                  y1: "100",
                  x2: "160",
                  y2: "420",
                  stroke: "oklch(0.25 0.01 50 / 0.4)",
                  strokeWidth: "1",
                  strokeDasharray: "6 4"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: "300",
                  y1: "100",
                  x2: "300",
                  y2: "420",
                  stroke: "oklch(0.25 0.01 50 / 0.4)",
                  strokeWidth: "1",
                  strokeDasharray: "6 4"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: "440",
                  y1: "100",
                  x2: "440",
                  y2: "420",
                  stroke: "oklch(0.25 0.01 50 / 0.4)",
                  strokeWidth: "1",
                  strokeDasharray: "6 4"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: "30",
                  y1: "200",
                  x2: "460",
                  y2: "200",
                  stroke: "oklch(0.25 0.01 50 / 0.3)",
                  strokeWidth: "1",
                  strokeDasharray: "6 4"
                }
              ),
              tables.map((table, index) => {
                const layout = getLayout(index);
                const isSelected = selectedTableId === table.id;
                const isAvailable = table.status === TableStatus.available;
                const cx = layout.x + layout.w / 2;
                const cy = layout.y + layout.h / 2;
                const isClickable = isAvailable || isSelected;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "g",
                  {
                    style: { cursor: isClickable ? "pointer" : "not-allowed" },
                    onClick: () => isClickable && onSelectTable(table),
                    onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && isClickable && onSelectTable(table),
                    tabIndex: isClickable ? 0 : -1,
                    "data-ocid": `floorplan.table.${index + 1}`,
                    "aria-label": `Table ${Number(table.number)}, seats ${Number(table.capacity)}, ${STATUS_LABEL[table.status]}`,
                    "aria-pressed": isSelected,
                    children: [
                      isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "ellipse",
                        {
                          cx,
                          cy,
                          rx: layout.w / 2 + 14,
                          ry: layout.h / 2 + 14,
                          fill: "url(#selected-glow)"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "rect",
                        {
                          x: layout.x,
                          y: layout.y,
                          width: layout.w,
                          height: layout.h,
                          rx: "8",
                          fill: STATUS_FILL[table.status],
                          stroke: isSelected ? "oklch(0.68 0.18 65)" : STATUS_STROKE[table.status],
                          strokeWidth: isSelected ? 2 : 1,
                          filter: isSelected ? "url(#glow-gold)" : void 0,
                          style: {
                            transition: "stroke 0.2s, stroke-width 0.2s"
                          }
                        }
                      ),
                      Array.from({ length: Math.min(Number(table.capacity), 4) }).map(
                        (_, ci) => {
                          const chairSpacing = layout.w / (Math.min(Number(table.capacity), 4) + 1);
                          const chairX = layout.x + chairSpacing * (ci + 1);
                          const chairKey = `chair-${table.id.toString()}-${ci}`;
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: chairX,
                                cy: layout.y - 6,
                                r: "4",
                                fill: "oklch(0.22 0.02 50)",
                                stroke: "oklch(0.3 0.02 50)",
                                strokeWidth: "0.5"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "circle",
                              {
                                cx: chairX,
                                cy: layout.y + layout.h + 6,
                                r: "4",
                                fill: "oklch(0.22 0.02 50)",
                                stroke: "oklch(0.3 0.02 50)",
                                strokeWidth: "0.5"
                              }
                            )
                          ] }, chairKey);
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "text",
                        {
                          x: cx,
                          y: cy - 5,
                          textAnchor: "middle",
                          fill: isSelected ? "oklch(0.68 0.18 65)" : isAvailable ? "oklch(0.82 0.12 65)" : "oklch(0.55 0.01 65)",
                          fontSize: "13",
                          fontWeight: "700",
                          fontFamily: "var(--font-display)",
                          style: { transition: "fill 0.2s" },
                          children: Number(table.number)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "text",
                        {
                          x: cx,
                          y: cy + 10,
                          textAnchor: "middle",
                          fill: isSelected ? "oklch(0.68 0.18 65 / 0.7)" : "oklch(0.5 0.01 65 / 0.7)",
                          fontSize: "9",
                          fontFamily: "var(--font-body)",
                          children: [
                            Number(table.capacity),
                            " seats"
                          ]
                        }
                      )
                    ]
                  },
                  table.id.toString()
                );
              })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-wrap items-center justify-center gap-4 mt-4 px-4",
            "data-ocid": "floorplan.legend",
            children: Object.entries(STATUS_LABEL).map(([status, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-3 h-3 rounded-sm border",
                  style: {
                    background: STATUS_FILL[status],
                    borderColor: STATUS_STROKE[status]
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-muted-foreground", children: label })
            ] }, status))
          }
        )
      ]
    }
  );
}
const OCCASION_EMOJI = {
  Birthday: "🎂",
  Anniversary: "💍",
  "Business Dinner": "💼",
  Engagement: "💎",
  Graduation: "🎓"
};
function ReservationConfirmation({
  reservation,
  onCancel,
  isCancelling
}) {
  const occasion = reservation.specialOccasion;
  const occasionEmoji = occasion ? OCCASION_EMOJI[occasion] ?? "✨" : null;
  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
  };
  const formatDate = (dateStr) => {
    const d = /* @__PURE__ */ new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { type: "spring", stiffness: 260, damping: 24 },
      className: "flex flex-col items-center gap-6",
      "data-ocid": "reservation_confirmation.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0, rotate: -45 },
            animate: { scale: 1, rotate: 0 },
            transition: { type: "spring", stiffness: 300, damping: 22, delay: 0.1 },
            className: "relative",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-gold-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "✓" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl text-gradient-gold italic", children: "Reservation Confirmed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-muted-foreground text-sm", children: [
            "We look forward to welcoming you,",
            " ",
            reservation.customerName.split(" ")[0]
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            className: "w-full max-w-sm rounded-xl border border-primary/20 bg-card overflow-hidden shadow-luxury",
            "data-ocid": "reservation_confirmation.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gradient-gold-accent px-5 py-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChefHat, { className: "w-4 h-4 text-primary-foreground/80" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body font-semibold text-primary-foreground text-sm tracking-wide", children: "youCallIT Fine Dining" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary-foreground/20 text-primary-foreground border-0 text-xs font-body", children: [
                  "#",
                  reservation.id.toString().padStart(4, "0")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-5 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DetailRow,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary" }),
                    label: "Date",
                    value: formatDate(reservation.date)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DetailRow,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary" }),
                    label: "Time",
                    value: formatTime(reservation.time)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DetailRow,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { className: "w-4 h-4 text-primary" }),
                    label: "Table",
                    value: `Table #${reservation.tableId.toString()}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DetailRow,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-primary" }),
                    label: "Guests",
                    value: `${reservation.guestCount.toString()} guests`
                  }
                ),
                occasionEmoji && occasion && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: occasionEmoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-foreground/80", children: occasion })
                ] }) }),
                reservation.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body italic", children: [
                  '"',
                  reservation.notes,
                  '"'
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 bg-muted/30 border-t border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                "Confirmation sent to",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/70", children: reservation.email })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.35 },
            className: "flex flex-col sm:flex-row gap-3 w-full max-w-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/chat/$orderId", params: { orderId: "0" }, className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 font-body transition-smooth gap-2",
                  "data-ocid": "reservation_confirmation.chat_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" }),
                    "Chat with Chef"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60 font-body transition-smooth gap-2",
                  onClick: onCancel,
                  disabled: isCancelling,
                  "data-ocid": "reservation_confirmation.cancel_button",
                  children: isCancelling ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-destructive/30 border-t-destructive animate-spin" }),
                    "Cancelling..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" }),
                    "Cancel"
                  ] })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function DetailRow({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body font-medium text-foreground truncate ml-2", children: value })
    ] })
  ] });
}
const OCCASIONS = [
  { value: "", label: "Just Dinner — No Special Occasion" },
  { value: "Birthday", label: "🎂 Birthday Celebration" },
  { value: "Anniversary", label: "💍 Anniversary" },
  { value: "Business Dinner", label: "💼 Business Dinner" },
  { value: "Engagement", label: "💎 Engagement" },
  { value: "Graduation", label: "🎓 Graduation" }
];
function ReservationForm({
  guestInfo,
  onUpdate,
  onSubmit,
  isSubmitting
}) {
  const [touched, setTouched] = reactExports.useState({});
  const set = (field, value) => onUpdate({ ...guestInfo, [field]: value });
  const blur = (field) => setTouched((t) => ({ ...t, [field]: true }));
  const isValid = guestInfo.name.trim().length >= 2 && guestInfo.phone.trim().length >= 7 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email);
  const fieldClass = (field, validate) => `bg-card border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/70 focus:ring-primary/20 transition-smooth font-body${touched[field] && validate ? " border-destructive/60" : ""}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -40 },
      transition: { type: "spring", stiffness: 300, damping: 30 },
      className: "space-y-6",
      "data-ocid": "reservation_form.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-foreground italic mb-1", children: "Your Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "We'll confirm your reservation by email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs tracking-widest uppercase text-muted-foreground font-body", children: "Full Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: guestInfo.name,
                onChange: (e) => set("name", e.target.value),
                onBlur: () => blur("name"),
                placeholder: "Your full name",
                className: fieldClass("name", guestInfo.name.trim().length < 2),
                "data-ocid": "reservation_form.name_input"
              }
            ),
            touched.name && guestInfo.name.trim().length < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive font-body",
                "data-ocid": "reservation_form.name_error",
                children: "Please enter your full name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs tracking-widest uppercase text-muted-foreground font-body", children: "Phone *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "tel",
                value: guestInfo.phone,
                onChange: (e) => set("phone", e.target.value),
                onBlur: () => blur("phone"),
                placeholder: "+1 (555) 000-0000",
                className: fieldClass("phone", guestInfo.phone.trim().length < 7),
                "data-ocid": "reservation_form.phone_input"
              }
            ),
            touched.phone && guestInfo.phone.trim().length < 7 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive font-body",
                "data-ocid": "reservation_form.phone_error",
                children: "Please enter a valid phone number"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs tracking-widest uppercase text-muted-foreground font-body", children: "Email *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "email",
                value: guestInfo.email,
                onChange: (e) => set("email", e.target.value),
                onBlur: () => blur("email"),
                placeholder: "you@example.com",
                className: fieldClass(
                  "email",
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)
                ),
                "data-ocid": "reservation_form.email_input"
              }
            ),
            touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email) && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive font-body",
                "data-ocid": "reservation_form.email_error",
                children: "Please enter a valid email"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs tracking-widest uppercase text-muted-foreground font-body", children: "Special Occasion" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: guestInfo.specialOccasion,
                onChange: (e) => set("specialOccasion", e.target.value),
                className: "w-full h-10 px-3 rounded-md bg-card border border-border/50 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/70 transition-smooth",
                "data-ocid": "reservation_form.occasion_select",
                children: OCCASIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, className: "bg-card", children: o.label }, o.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs tracking-widest uppercase text-muted-foreground font-body", children: "Special Requests & Seating Preferences" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: guestInfo.notes,
                onChange: (e) => set("notes", e.target.value),
                placeholder: "Window seat preference, dietary requirements, accessibility needs...",
                className: "bg-card border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/70 font-body resize-none",
                rows: 3,
                "data-ocid": "reservation_form.notes_textarea"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: onSubmit,
            disabled: !isValid || isSubmitting,
            className: "w-full gradient-gold-accent text-primary-foreground font-body font-semibold tracking-wide shadow-gold-glow hover:opacity-90 transition-smooth h-12",
            "data-ocid": "reservation_form.submit_button",
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" }),
              "Confirming Reservation..."
            ] }) : "Confirm Reservation"
          }
        )
      ]
    }
  );
}
const TIME_SLOTS = [];
for (let h = 11; h <= 22; h++) {
  TIME_SLOTS.push(`${h.toString().padStart(2, "0")}:00`);
  if (h < 22) TIME_SLOTS.push(`${h.toString().padStart(2, "0")}:30`);
}
function formatSlot(slot) {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}
const STEPS = [
  { id: 1, label: "Date & Time", icon: Calendar },
  { id: 2, label: "Choose Table", icon: Table },
  { id: 3, label: "Your Details", icon: Users },
  { id: 4, label: "Confirmed", icon: Check }
];
function StepIndicator({ current }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex items-center justify-center gap-2 mb-10",
      "data-ocid": "reservations.step_indicator",
      children: STEPS.map((step, index) => {
        const Icon = step.icon;
        const done = current > step.id;
        const active = current === step.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: {
                  background: done || active ? "oklch(0.68 0.18 65)" : "oklch(0.2 0.022 50)",
                  borderColor: done || active ? "oklch(0.68 0.18 65)" : "oklch(0.28 0.02 50)",
                  scale: active ? 1.15 : 1
                },
                transition: { duration: 0.3 },
                className: "w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-sm",
                children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: `w-4 h-4 ${active ? "text-primary-foreground" : "text-muted-foreground"}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-body hidden sm:block ${active ? "text-primary" : done ? "text-foreground/60" : "text-muted-foreground"}`,
                children: step.label
              }
            )
          ] }),
          index < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: {
                background: done ? "oklch(0.68 0.18 65 / 0.6)" : "oklch(0.28 0.02 50)"
              },
              transition: { duration: 0.3 },
              className: "w-12 sm:w-16 h-0.5 mx-1 mt-[-14px]"
            }
          )
        ] }, step.id);
      })
    }
  );
}
const DEMO_TABLES = Array.from({ length: 10 }, (_, i) => ({
  id: BigInt(i + 1),
  number: BigInt(i + 1),
  capacity: BigInt([2, 2, 4, 4, 4, 6, 2, 2, 4, 8][i]),
  x: BigInt(0),
  y: BigInt(0),
  status: [
    TableStatus.available,
    TableStatus.available,
    TableStatus.reserved,
    TableStatus.available,
    TableStatus.occupied,
    TableStatus.available,
    TableStatus.available,
    TableStatus.reserved,
    TableStatus.available,
    TableStatus.available
  ][i]
}));
function ReservationsPage() {
  const [step, setStep] = reactExports.useState(1);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [date, setDate] = reactExports.useState(today);
  const [time, setTime] = reactExports.useState("");
  const [guestCount, setGuestCount] = reactExports.useState(2);
  const [selectedTable, setSelectedTable] = reactExports.useState(null);
  const [guestInfo, setGuestInfo] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    specialOccasion: "",
    notes: ""
  });
  const [confirmedReservation, setConfirmedReservation] = reactExports.useState(null);
  const { data: availableTables = [], isLoading: tablesLoading } = useAvailableTables(date, time, BigInt(guestCount));
  const makeReservation = useMakeReservation();
  const cancelReservation = useCancelReservation();
  const floorTables = reactExports.useMemo(
    () => step === 2 && availableTables.length > 0 ? availableTables : DEMO_TABLES,
    [step, availableTables]
  );
  const handleStep1Next = () => {
    if (!date || !time) {
      ue.error("Please select a date and time");
      return;
    }
    setStep(2);
  };
  const handleStep2Next = () => {
    if (!selectedTable) {
      ue.error("Please select a table from the floor plan");
      return;
    }
    setStep(3);
  };
  const handleSubmit = async () => {
    if (!selectedTable) return;
    try {
      const result = await makeReservation.mutateAsync({
        tableId: selectedTable.id,
        guestCount: BigInt(guestCount),
        date,
        time,
        customerName: guestInfo.name,
        phone: guestInfo.phone,
        email: guestInfo.email,
        specialOccasion: guestInfo.specialOccasion || null,
        notes: guestInfo.notes || null
      });
      setConfirmedReservation(result);
      setStep(4);
      ue.success("Reservation confirmed! 🎉");
    } catch {
      ue.error("Unable to complete reservation. Please try again.");
    }
  };
  const handleCancel = async () => {
    if (!confirmedReservation) return;
    try {
      await cancelReservation.mutateAsync(confirmedReservation.id);
      ue.success("Reservation cancelled");
      setStep(1);
      setConfirmedReservation(null);
      setSelectedTable(null);
      setGuestInfo({
        name: "",
        phone: "",
        email: "",
        specialOccasion: "",
        notes: ""
      });
    } catch {
      ue.error("Unable to cancel reservation");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background py-10 px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.h1,
        {
          initial: { opacity: 0, y: -16 },
          animate: { opacity: 1, y: 0 },
          className: "font-display italic text-4xl sm:text-5xl text-gradient-gold mb-2",
          children: "Reserve Your Table"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.p,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.15 },
          className: "font-body text-muted-foreground",
          children: "Secure your seat at the finest table in the city"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: step }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl border border-border/30 shadow-luxury overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            transition: { type: "spring", stiffness: 300, damping: 30 },
            className: "p-6 sm:p-10 space-y-8",
            "data-ocid": "reservations.step1_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display italic text-2xl text-foreground mb-1", children: "When Are You Visiting?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-muted-foreground text-sm", children: "Select your preferred date, time, and party size" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "res-date",
                    className: "text-xs font-body tracking-widest uppercase text-muted-foreground",
                    children: "Date"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70 pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "res-date",
                      type: "date",
                      value: date,
                      min: today,
                      onChange: (e) => {
                        setDate(e.target.value);
                        setSelectedTable(null);
                      },
                      className: "w-full h-11 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/70 transition-smooth [color-scheme:dark]",
                      "data-ocid": "reservations.date_input"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body tracking-widest uppercase text-muted-foreground", children: "Party Size" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "icon",
                      className: "w-10 h-10 rounded-full border-border/50 hover:border-primary/50 hover:text-primary transition-smooth",
                      onClick: () => setGuestCount((c) => Math.max(1, c - 1)),
                      disabled: guestCount <= 1,
                      "data-ocid": "reservations.guest_decrement_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.span,
                    {
                      initial: { scale: 0.8, opacity: 0 },
                      animate: { scale: 1, opacity: 1 },
                      className: "font-display italic text-3xl text-foreground min-w-[3rem] text-center",
                      children: guestCount
                    },
                    guestCount
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "icon",
                      className: "w-10 h-10 rounded-full border-border/50 hover:border-primary/50 hover:text-primary transition-smooth",
                      onClick: () => setGuestCount((c) => Math.min(12, c + 1)),
                      disabled: guestCount >= 12,
                      "data-ocid": "reservations.guest_increment_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-muted-foreground text-sm", children: guestCount === 1 ? "guest" : "guests" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body tracking-widest uppercase text-muted-foreground", children: "Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "grid grid-cols-4 sm:grid-cols-6 gap-2",
                    "data-ocid": "reservations.time_slots",
                    children: TIME_SLOTS.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.button,
                      {
                        type: "button",
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.97 },
                        onClick: () => {
                          setTime(slot);
                          setSelectedTable(null);
                        },
                        className: `py-2 px-1 rounded-lg text-xs font-body font-medium transition-smooth border ${time === slot ? "bg-primary/15 border-primary/60 text-primary shadow-gold-glow" : "bg-muted/20 border-border/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"}`,
                        "data-ocid": `reservations.time_slot.${slot.replace(":", "")}`,
                        children: formatSlot(slot)
                      },
                      slot
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  onClick: handleStep1Next,
                  disabled: !date || !time,
                  className: "w-full gradient-gold-accent text-primary-foreground font-body font-semibold h-12 gap-2 shadow-gold-glow hover:opacity-90 transition-smooth",
                  "data-ocid": "reservations.step1_next_button",
                  children: [
                    "Choose Your Table",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                  ]
                }
              )
            ]
          },
          "step1"
        ),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            transition: { type: "spring", stiffness: 300, damping: 30 },
            className: "p-6 sm:p-10 space-y-6",
            "data-ocid": "reservations.step2_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display italic text-2xl text-foreground mb-1", children: "Choose Your Table" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-muted-foreground text-sm", children: [
                  date,
                  " at ",
                  formatSlot(time),
                  " — ",
                  guestCount,
                  " ",
                  guestCount === 1 ? "guest" : "guests"
                ] })
              ] }),
              tablesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-80 rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded" }, i)) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                FloorPlan,
                {
                  tables: floorTables,
                  selectedTableId: (selectedTable == null ? void 0 : selectedTable.id) ?? null,
                  onSelectTable: setSelectedTable
                }
              ),
              selectedTable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                  className: "flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/30",
                  "data-ocid": "reservations.selected_table_info",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { className: "w-4 h-4 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-body font-semibold text-foreground", children: [
                        "Table #",
                        Number(selectedTable.number),
                        " selected"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                        "Seats up to ",
                        Number(selectedTable.capacity),
                        " guests"
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    className: "flex-1 border-border/40 font-body transition-smooth gap-2",
                    onClick: () => setStep(1),
                    "data-ocid": "reservations.step2_back_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                      "Back"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    onClick: handleStep2Next,
                    disabled: !selectedTable,
                    className: "flex-1 gradient-gold-accent text-primary-foreground font-body font-semibold gap-2 shadow-gold-glow hover:opacity-90 transition-smooth",
                    "data-ocid": "reservations.step2_next_button",
                    children: [
                      "Your Details",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                    ]
                  }
                )
              ] })
            ]
          },
          "step2"
        ),
        step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            transition: { type: "spring", stiffness: 300, damping: 30 },
            className: "p-6 sm:p-10",
            "data-ocid": "reservations.step3_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setStep(2),
                  className: "flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-smooth",
                  "data-ocid": "reservations.step3_back_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                    "Back to floor plan"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReservationForm,
                {
                  guestInfo,
                  onUpdate: setGuestInfo,
                  onSubmit: handleSubmit,
                  isSubmitting: makeReservation.isPending
                }
              )
            ]
          },
          "step3"
        ),
        step === 4 && confirmedReservation && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -40 },
            transition: { type: "spring", stiffness: 300, damping: 30 },
            className: "p-6 sm:p-10",
            "data-ocid": "reservations.step4_panel",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReservationConfirmation,
              {
                reservation: confirmedReservation,
                onCancel: handleCancel,
                isCancelling: cancelReservation.isPending
              }
            )
          },
          "step4"
        )
      ] }) }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(PastReservationsSection, {})
    ] })
  ] });
}
function PastReservationsSection() {
  const { data: reservations = [], isLoading } = useCustomerReservations();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-40 h-5 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-20 rounded-xl" })
    ] });
  }
  if (reservations.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.3 },
      className: "mt-8",
      "data-ocid": "reservations.past_section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body text-sm uppercase tracking-widest text-muted-foreground mb-4", children: "Your Recent Reservations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: reservations.slice(0, 3).map((res, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border/20",
            "data-ocid": `reservations.past_item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary/70" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-body text-foreground", children: [
                    res.date,
                    " at ",
                    res.time
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                    "Table #",
                    res.tableId.toString(),
                    " · ",
                    Number(res.guestCount),
                    " ",
                    "guests"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs font-body px-2 py-1 rounded-full border ${res.status === "confirmed" ? "bg-primary/10 border-primary/30 text-primary" : res.status === "cancelled" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-muted/30 border-border/20 text-muted-foreground"}`,
                  children: String(res.status).charAt(0).toUpperCase() + String(res.status).slice(1)
                }
              )
            ]
          },
          res.id.toString()
        )) })
      ]
    }
  );
}
export {
  ReservationsPage as default
};
