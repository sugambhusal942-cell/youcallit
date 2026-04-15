import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, MessageCircle, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import type { MenuItem, Order } from "../types";
import { PriceDisplay } from "./ui/PriceDisplay";

interface OrderConfirmationProps {
  order: Order;
  menuItems: MenuItem[];
  onOrderAgain: () => void;
}

function AnimatedCheck() {
  return (
    <motion.div
      className="relative w-24 h-24 mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
    >
      {/* Glowing circle bg */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.3, opacity: 0 }}
        transition={{
          duration: 1.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeOut",
          delay: 0.6,
        }}
      />
      <div className="w-24 h-24 rounded-full bg-primary/15 border-2 border-primary/50 flex items-center justify-center">
        <svg
          viewBox="0 0 52 52"
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          aria-label="Order confirmed checkmark"
        >
          <title>Order confirmed</title>
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            className="stroke-primary"
            strokeWidth="2"
            strokeDasharray={145}
            initial={{ strokeDashoffset: 145 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          />
          <motion.path
            d="M14 26 l8 8 l16 -16"
            className="stroke-primary"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={40}
            strokeDashoffset={40}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.7 }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

export function OrderConfirmation({
  order,
  menuItems,
  onOrderAgain,
}: OrderConfirmationProps) {
  const menuMap = new Map(menuItems.map((m) => [m.id.toString(), m]));
  const isInDine = order.orderType === "dineIn";
  const estimatedTime = isInDine ? "20–30 min" : "15–20 min";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="max-w-lg mx-auto px-4 py-12 space-y-8"
      data-ocid="order_confirmation.panel"
    >
      {/* Animated checkmark */}
      <AnimatedCheck />

      {/* Headline */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="font-display text-3xl text-foreground">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground text-sm">
          Thank you for dining with youCallIT. Your order is being prepared.
        </p>
      </motion.div>

      {/* Order meta card */}
      <motion.div
        className="bg-card border border-border rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="grid grid-cols-3 divide-x divide-border">
          {[
            { label: "Order ID", value: `#${order.id.toString()}` },
            { label: "Type", value: isInDine ? "Dine In" : "Takeout" },
            {
              label: "Est. Wait",
              value: estimatedTime,
              icon: <Clock className="w-3 h-3 inline mr-1 text-primary" />,
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-sm font-semibold text-foreground min-w-0 truncate">
                {icon}
                {value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Items list */}
      <motion.div
        className="bg-card border border-border rounded-2xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Order Summary
          </h3>
        </div>
        <ul
          className="divide-y divide-border"
          data-ocid="order_confirmation.items_list"
        >
          {order.items.map((item) => {
            const menuItem = menuMap.get(item.menuItemId.toString());
            return (
              <li
                key={item.menuItemId.toString()}
                className="flex items-center gap-3 px-5 py-3"
                data-ocid={`order_confirmation.item.${item.menuItemId.toString()}`}
              >
                {menuItem?.imageUrl && (
                  <img
                    src={menuItem.imageUrl}
                    alt={menuItem?.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {menuItem?.name ?? `Item #${item.menuItemId.toString()}`}
                  </p>
                  {item.specialInstructions && (
                    <p className="text-xs text-muted-foreground truncate">
                      {item.specialInstructions}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-muted-foreground text-xs">
                    ×{item.quantity.toString()}
                  </span>
                  {menuItem && (
                    <PriceDisplay
                      cents={BigInt(
                        Number(menuItem.price) * Number(item.quantity),
                      )}
                      className="text-sm font-semibold text-foreground"
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <Separator />
        <div className="px-5 py-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <PriceDisplay cents={order.subtotal} />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <PriceDisplay cents={order.tax} />
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between font-bold text-base text-foreground">
            <span>Total</span>
            <span className="text-primary">
              <PriceDisplay cents={order.total} />
            </span>
          </div>
        </div>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
      >
        <Link
          to="/chat/$orderId"
          params={{ orderId: order.id.toString() }}
          className="flex-1"
          data-ocid="order_confirmation.chat_chef_button"
        >
          <Button
            variant="default"
            className="w-full py-5 bg-primary text-primary-foreground hover:opacity-90 transition-smooth flex items-center gap-2 font-semibold"
          >
            <MessageCircle className="w-5 h-5" />
            Chat with Chef
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex-1 py-5 border-border hover:border-primary transition-smooth flex items-center gap-2"
          onClick={onOrderAgain}
          data-ocid="order_confirmation.order_again_button"
        >
          <RotateCcw className="w-4 h-4" />
          Order Again
        </Button>
      </motion.div>

      {/* Status note */}
      <motion.p
        className="text-center text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-primary" />
        We'll notify you as soon as your order status changes.
      </motion.p>
    </motion.div>
  );
}
