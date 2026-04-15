import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend";
import type { Order } from "../../backend";
import {
  useAllOrders,
  useMenuItems,
  useUpdateOrderStatus,
} from "../../hooks/useQueries";
import { PriceDisplay } from "../ui/PriceDisplay";
import { StatusBadge } from "../ui/StatusBadge";

const STATUS_GROUPS: {
  key: string;
  label: string;
  statuses: OrderStatus[];
  color: string;
  dot: string;
}[] = [
  {
    key: "new",
    label: "New",
    statuses: [OrderStatus.pending],
    color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  {
    key: "preparing",
    label: "Preparing",
    statuses: [OrderStatus.confirmed, OrderStatus.preparing],
    color: "text-orange-400",
    dot: "bg-orange-400",
  },
  {
    key: "ready",
    label: "Ready / Done",
    statuses: [OrderStatus.ready, OrderStatus.completed],
    color: "text-emerald-400",
    dot: "bg-emerald-400",
  },
];

const ALL_STATUSES: OrderStatus[] = [
  OrderStatus.pending,
  OrderStatus.confirmed,
  OrderStatus.preparing,
  OrderStatus.ready,
  OrderStatus.completed,
  OrderStatus.cancelled,
];

function OrderCard({
  order,
  menuItemMap,
  index,
}: {
  order: Order;
  menuItemMap: Map<string, string>;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  function handleStatusChange(status: string) {
    updateStatus(
      { id: order.id, status: status as OrderStatus },
      {
        onSuccess: () => toast.success(`Order #${order.id} status updated`),
        onError: () => toast.error("Failed to update status"),
      },
    );
  }

  const timeAgo = (() => {
    const ms = Number(order.createdAt / 1_000_000n);
    const diff = Math.floor((Date.now() - ms) / 60000);
    if (diff < 1) return "Just now";
    if (diff === 1) return "1 min ago";
    return `${diff} mins ago`;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
      data-ocid={`orders.item.${index + 1}`}
    >
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm">
              #{String(order.id)}
            </span>
            <StatusBadge status={order.status} />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {order.orderType === "dineIn" ? "Dine In" : "Takeout"}
            </span>
            {order.tableNumber !== undefined && (
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                Table {String(order.tableNumber)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeAgo}
            </span>
            <PriceDisplay
              cents={order.total}
              className="text-sm font-semibold text-primary"
            />
            <span className="text-xs text-muted-foreground">
              {order.items.length} item
              {order.items.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={order.status}
            onValueChange={handleStatusChange}
            disabled={isPending}
          >
            <SelectTrigger
              className="w-36 h-8 text-xs bg-secondary border-border"
              data-ocid={`orders.status_select.${index + 1}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-smooth text-muted-foreground"
            data-ocid={`orders.expand_button.${index + 1}`}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 bg-secondary/30 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">
                Order Items
              </p>
              {order.items.map((item, i) => (
                <div
                  key={`${String(order.id)}-item-${i}`}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-primary font-semibold w-5 text-center">
                    {String(item.quantity)}×
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground">
                      {menuItemMap.get(String(item.menuItemId)) ??
                        `Item #${String(item.menuItemId)}`}
                    </span>
                    {item.specialInstructions && (
                      <p className="text-xs text-muted-foreground italic mt-0.5">
                        "{item.specialInstructions}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {order.specialInstructions && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Special Instructions
                  </p>
                  <p className="text-sm text-foreground italic">
                    "{order.specialInstructions}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function OrdersQueue() {
  const { data: orders = [], isLoading, refetch, isFetching } = useAllOrders();
  const { data: menuItems = [] } = useMenuItems();

  const menuItemMap = new Map(menuItems.map((m) => [String(m.id), m.name]));

  const activeOrders = orders.filter(
    (o) =>
      o.status !== OrderStatus.completed && o.status !== OrderStatus.cancelled,
  );

  const grouped = STATUS_GROUPS.map((group) => ({
    ...group,
    orders: activeOrders.filter((o) =>
      group.statuses.includes(o.status as OrderStatus),
    ),
  }));

  const archived = orders.filter(
    (o) =>
      o.status === OrderStatus.completed || o.status === OrderStatus.cancelled,
  );

  return (
    <div className="p-6 h-full overflow-auto" data-ocid="orders.panel">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display italic text-2xl text-foreground">
            Orders Queue
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {activeOrders.length} active order
            {activeOrders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground text-sm transition-smooth"
          data-ocid="orders.refresh_button"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : activeOrders.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center h-64 text-center"
          data-ocid="orders.empty_state"
        >
          <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-foreground font-medium">No active orders</p>
          <p className="text-muted-foreground text-sm mt-1">
            New orders will appear here automatically
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {grouped.map((group) => (
            <div key={group.key} data-ocid={`orders.group.${group.key}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${group.dot}`} />
                <h2
                  className={`text-sm font-semibold uppercase tracking-wider ${group.color}`}
                >
                  {group.label}
                </h2>
                <span className="ml-auto bg-secondary text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                  {group.orders.length}
                </span>
              </div>
              <div className="space-y-3">
                {group.orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm bg-secondary/20 rounded-xl border border-dashed border-border">
                    <AlertCircle className="w-5 h-5 mx-auto mb-1 opacity-40" />
                    No orders here
                  </div>
                ) : (
                  group.orders.map((order, i) => (
                    <OrderCard
                      key={String(order.id)}
                      order={order}
                      menuItemMap={menuItemMap}
                      index={i}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archived */}
      {archived.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Recent Completed / Cancelled
          </h2>
          <div className="space-y-2">
            {archived.slice(0, 6).map((order, i) => (
              <div
                key={String(order.id)}
                className="flex items-center gap-3 px-4 py-3 bg-card/60 rounded-xl border border-border/50 text-sm"
                data-ocid={`orders.archived.${i + 1}`}
              >
                <span className="text-muted-foreground">
                  #{String(order.id)}
                </span>
                <StatusBadge status={order.status} />
                <PriceDisplay
                  cents={order.total}
                  className="text-muted-foreground ml-auto"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
