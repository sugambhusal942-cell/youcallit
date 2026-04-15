import { q as jsxRuntimeExports, y as Badge } from "./index-BMSJKAYU.js";
const STATUS_CONFIG = {
  preparing: {
    label: "Preparing",
    className: "bg-orange-900/40 text-orange-300 border-orange-700/40"
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-900/40 text-red-300 border-red-700/40"
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40"
  },
  completed: {
    label: "Completed",
    className: "bg-muted/60 text-muted-foreground border-border"
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40"
  },
  ready: {
    label: "Ready",
    className: "bg-blue-900/40 text-blue-300 border-blue-700/40"
  },
  available: {
    label: "Available",
    className: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40"
  },
  reserved: {
    label: "Reserved",
    className: "bg-blue-900/40 text-blue-300 border-blue-700/40"
  },
  occupied: {
    label: "Occupied",
    className: "bg-orange-900/40 text-orange-300 border-orange-700/40"
  },
  maintenance: {
    label: "Maintenance",
    className: "bg-muted/60 text-muted-foreground border-border"
  }
};
function StatusBadge({ status, className = "" }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: `text-xs font-body border ${config.className} ${className}`,
      children: config.label
    }
  );
}
export {
  StatusBadge as S
};
