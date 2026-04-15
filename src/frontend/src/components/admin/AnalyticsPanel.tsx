import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ChefHat,
  DollarSign,
  MessageSquare,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../../backend";
import {
  useAllOpenThreads,
  useAllOrders,
  useAllReservations,
  useMenuItems,
} from "../../hooks/useQueries";
import { PriceDisplay } from "../ui/PriceDisplay";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  index: number;
}

function StatCard({ label, value, icon, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/20 transition-smooth"
      data-ocid={`analytics.stat.${index + 1}`}
    >
      <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>{icon}</div>
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium mb-1">
          {label}
        </p>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </div>
    </motion.div>
  );
}

export function AnalyticsPanel() {
  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();
  const { data: reservations = [], isLoading: resLoading } =
    useAllReservations();
  const { data: threads = [], isLoading: threadsLoading } = useAllOpenThreads();
  const { data: menuItems = [], isLoading: menuLoading } = useMenuItems();

  const isLoading =
    ordersLoading || resLoading || threadsLoading || menuLoading;

  const todayOrders = orders.filter(
    (o) =>
      o.status !== OrderStatus.cancelled &&
      new Date(Number(o.createdAt / 1_000_000n))
        .toISOString()
        .startsWith(today()),
  );

  const todayRevenue = todayOrders.reduce((acc, o) => acc + Number(o.total), 0);

  const todayReservations = reservations.filter(
    (r) => r.date === today() && r.status !== "cancelled",
  );

  const itemCount = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      const key = String(item.menuItemId);
      itemCount.set(key, (itemCount.get(key) ?? 0) + Number(item.quantity));
    }
  }

  const menuItemMap = new Map(menuItems.map((m) => [String(m.id), m.name]));

  const popularItems = [...itemCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, count]) => ({
      name: menuItemMap.get(id) ?? `Item #${id}`,
      count,
    }));

  const statusBreakdown: { label: string; count: number; color: string }[] = [
    {
      label: "Pending",
      count: orders.filter((o) => o.status === OrderStatus.pending).length,
      color: "bg-yellow-400",
    },
    {
      label: "Confirmed",
      count: orders.filter((o) => o.status === OrderStatus.confirmed).length,
      color: "bg-blue-400",
    },
    {
      label: "Preparing",
      count: orders.filter((o) => o.status === OrderStatus.preparing).length,
      color: "bg-orange-400",
    },
    {
      label: "Ready",
      count: orders.filter((o) => o.status === OrderStatus.ready).length,
      color: "bg-emerald-400",
    },
    {
      label: "Completed",
      count: orders.filter((o) => o.status === OrderStatus.completed).length,
      color: "bg-primary",
    },
  ];

  return (
    <div className="p-6 h-full overflow-auto" data-ocid="analytics.panel">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <ChefHat className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display italic text-2xl text-foreground">
            Kitchen Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">
            Kitchen Live
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Today's Orders"
            value={todayOrders.length}
            icon={<ShoppingBag className="w-5 h-5 text-primary" />}
            color="bg-primary/10"
            index={0}
          />
          <StatCard
            label="Today's Revenue"
            value={
              <PriceDisplay
                cents={todayRevenue}
                className="text-2xl font-bold"
              />
            }
            icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            color="bg-emerald-900/30"
            index={1}
          />
          <StatCard
            label="Today's Reservations"
            value={todayReservations.length}
            icon={<Calendar className="w-5 h-5 text-blue-400" />}
            color="bg-blue-900/30"
            index={2}
          />
          <StatCard
            label="Open Chat Threads"
            value={threads.length}
            icon={<MessageSquare className="w-5 h-5 text-orange-400" />}
            color="bg-orange-900/30"
            index={3}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-2xl p-5"
          data-ocid="analytics.order_status_section"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-medium text-foreground">
              Order Status Overview
            </h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {statusBreakdown.map((item) => {
                const pct =
                  orders.length > 0
                    ? Math.round((item.count / orders.length) * 100)
                    : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{item.label}</span>
                      <span>
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground text-right mt-2">
                {orders.length} total orders
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-2xl p-5"
          data-ocid="analytics.popular_items_section"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-primary" />
            <h2 className="font-medium text-foreground">Popular Items</h2>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : popularItems.length === 0 ? (
            <div
              className="flex items-center justify-center py-8 text-center"
              data-ocid="analytics.popular_items.empty_state"
            >
              <p className="text-muted-foreground text-sm">No order data yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {popularItems.map((item, i) => {
                const maxCount = popularItems[0]?.count ?? 1;
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="flex items-center gap-3"
                    data-ocid={`analytics.popular_item.${i + 1}`}
                  >
                    <span className="text-xs text-primary font-bold w-5 text-center">
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground font-medium truncate">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {item.count} orders
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.7,
                            delay: 0.6 + i * 0.06,
                          }}
                          className="h-full rounded-full gradient-gold-accent"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-card border border-border rounded-2xl p-5 lg:col-span-2"
          data-ocid="analytics.reservations_section"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="font-medium text-foreground">
                Today's Upcoming Reservations
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {todayReservations.length} reservation
              {todayReservations.length !== 1 ? "s" : ""}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : todayReservations.length === 0 ? (
            <div
              className="text-center py-6"
              data-ocid="analytics.reservations.empty_state"
            >
              <p className="text-muted-foreground text-sm">
                No reservations today
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {todayReservations
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((res, i) => (
                  <div
                    key={String(res.id)}
                    className="bg-secondary/50 border border-border/50 rounded-xl p-3 text-center"
                    data-ocid={`analytics.reservation_card.${i + 1}`}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {res.time}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {res.customerName.split(" ")[0]}
                    </p>
                    <p className="text-xs text-primary mt-1">
                      {String(res.guestCount)} pax
                    </p>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
