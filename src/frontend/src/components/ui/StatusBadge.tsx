import { Badge } from "@/components/ui/badge";

type AnyStatus = string;

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  preparing: {
    label: "Preparing",
    className: "bg-orange-900/40 text-orange-300 border-orange-700/40",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-900/40 text-red-300 border-red-700/40",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40",
  },
  completed: {
    label: "Completed",
    className: "bg-muted/60 text-muted-foreground border-border",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  },
  ready: {
    label: "Ready",
    className: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  },
  available: {
    label: "Available",
    className: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  },
  reserved: {
    label: "Reserved",
    className: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  },
  occupied: {
    label: "Occupied",
    className: "bg-orange-900/40 text-orange-300 border-orange-700/40",
  },
  maintenance: {
    label: "Maintenance",
    className: "bg-muted/60 text-muted-foreground border-border",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge
      variant="outline"
      className={`text-xs font-body border ${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
}
