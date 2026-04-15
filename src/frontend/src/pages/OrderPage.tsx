import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  ClockIcon,
  MessageCircleIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  Trash2Icon,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderType } from "../backend";
import { CheckoutForm } from "../components/CheckoutForm";
import type { CheckoutFormData } from "../components/CheckoutForm";
import { OrderConfirmation } from "../components/OrderConfirmation";
import { PageLoader } from "../components/ui/LoadingSpinner";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  useCancelOrder,
  useCustomerOrders,
  useMenuItems,
  usePlaceOrder,
} from "../hooks/useQueries";
import { useCartStore } from "../store/cartStore";
import type { Order } from "../types";

const TAX_RATE = 0.08;

export default function OrderPage() {
  const { login, isAuthenticated } = useInternetIdentity();
  const { items, subtotal, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading: ordersLoading } = useCustomerOrders();
  const { data: menuItems = [] } = useMenuItems();
  const placeOrder = usePlaceOrder();
  const cancelOrder = useCancelOrder();

  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  async function handleCheckoutSubmit(data: CheckoutFormData) {
    if (!isAuthenticated) {
      toast.error("Please sign in to place an order.");
      login();
      return;
    }
    const orderItems = items.map((ci) => ({
      menuItemId: ci.menuItem.id,
      quantity: BigInt(ci.quantity),
      specialInstructions: ci.specialInstructions,
    }));
    const tableNum =
      data.orderType === OrderType.dineIn && data.tableNumber
        ? BigInt(Number.parseInt(data.tableNumber, 10))
        : null;
    try {
      const result = await placeOrder.mutateAsync({
        items: orderItems,
        orderType: data.orderType,
        specialInstructions: data.specialInstructions,
        tableNumber: tableNum,
      });
      clearCart();
      setConfirmedOrder(result as Order);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  }

  // ── Confirmation screen
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-background">
        <OrderConfirmation
          order={confirmedOrder}
          menuItems={menuItems}
          onOrderAgain={() => setConfirmedOrder(null)}
        />
      </div>
    );
  }

  // ── Empty cart (no history either shown in main view)
  if (
    items.length === 0 &&
    (!orders || orders.length === 0) &&
    !ordersLoading
  ) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4"
        data-ocid="order.empty_state"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="w-32 h-32 rounded-full bg-muted border border-border flex items-center justify-center shadow-luxury"
        >
          <motion.div
            animate={{ rotate: [0, -4, 4, -4, 4, 0] }}
            transition={{
              duration: 2.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3.5,
            }}
          >
            <ShoppingBagIcon className="w-14 h-14 text-muted-foreground/30" />
          </motion.div>
        </motion.div>
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display italic text-3xl text-foreground">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            Explore our curated menu and add your favourite dishes to begin your
            order.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Link to="/menu">
            <Button
              className="gradient-gold-accent border-0 text-primary-foreground hover:opacity-90 transition-smooth px-8 py-5 text-base font-semibold shadow-gold-glow"
              data-ocid="order.browse_menu_button"
            >
              Explore the Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background py-10 px-4"
      data-ocid="order.page"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-primary mb-2">
            Checkout
          </p>
          <h1 className="font-display italic text-4xl md:text-5xl text-foreground">
            Your <span className="text-gradient-gold">Order</span>
          </h1>
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-16">
            {/* Cart + items */}
            <motion.div
              className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
            >
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h2 className="font-body font-semibold text-foreground flex items-center gap-2">
                  <ShoppingBagIcon className="w-4 h-4 text-primary" />
                  Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </h2>
                <Link
                  to="/menu"
                  className="text-primary text-xs hover:opacity-70 transition-smooth"
                >
                  + Add more
                </Link>
              </div>

              <ScrollArea className="max-h-80">
                <ul
                  className="divide-y divide-border"
                  data-ocid="order.items_list"
                >
                  {items.map((item, i) => (
                    <motion.li
                      key={item.menuItem.id.toString()}
                      layout
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 px-6 py-4"
                      data-ocid={`order.item.${i + 1}`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {item.menuItem.imageUrl ? (
                          <img
                            src={item.menuItem.imageUrl}
                            alt={item.menuItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-foreground text-sm truncate">
                          {item.menuItem.name}
                        </p>
                        <PriceDisplay
                          cents={item.menuItem.price}
                          className="text-primary text-xs font-body"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth"
                          onClick={() =>
                            updateQuantity(item.menuItem.id, item.quantity - 1)
                          }
                          data-ocid={`order.decrease_button.${i + 1}`}
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-body">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth"
                          onClick={() =>
                            updateQuantity(item.menuItem.id, item.quantity + 1)
                          }
                          data-ocid={`order.increase_button.${i + 1}`}
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 flex items-center justify-center hover:text-destructive transition-smooth ml-1"
                          onClick={() => removeItem(item.menuItem.id)}
                          data-ocid={`order.remove_button.${i + 1}`}
                        >
                          <Trash2Icon className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive transition-smooth" />
                        </button>
                      </div>
                      <div className="w-16 text-right flex-shrink-0">
                        <PriceDisplay
                          cents={BigInt(
                            Math.round(
                              Number(item.menuItem.price) * item.quantity,
                            ),
                          )}
                          className="text-sm font-semibold text-foreground"
                        />
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </ScrollArea>

              {/* Totals */}
              <div className="border-t border-border px-6 py-5 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <PriceDisplay cents={subtotal} className="text-foreground" />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (8%)</span>
                  <PriceDisplay cents={tax} className="text-foreground" />
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <PriceDisplay cents={total} className="text-primary" />
                </div>
              </div>
            </motion.div>

            {/* Checkout form */}
            <motion.div
              className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
            >
              <h2 className="font-body font-semibold text-foreground text-lg mb-6">
                Order Details
              </h2>
              <CheckoutForm
                cartItems={items}
                onSubmit={handleCheckoutSubmit}
                isSubmitting={placeOrder.isPending}
              />
            </motion.div>
          </div>
        ) : null}

        {/* Order History */}
        <div className="mt-4">
          <h2 className="font-body font-semibold text-foreground text-xl mb-6 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-primary" />
            Order History
          </h2>

          {ordersLoading ? (
            <PageLoader />
          ) : !orders || orders.length === 0 ? (
            <div
              className="bg-card border border-border rounded-2xl p-8 text-center"
              data-ocid="order.history_empty_state"
            >
              <p className="text-muted-foreground font-body text-sm">
                No orders yet. Start by exploring our menu!
              </p>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="order.history_list">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  data-ocid={`order.history_item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-body text-muted-foreground">
                        Order #{order.id.toString()}
                      </span>
                      <StatusBadge status={order.status} />
                      <Badge
                        variant="outline"
                        className="text-xs font-body border-border/30 text-muted-foreground"
                      >
                        {order.orderType === "dineIn" ? "Dine In" : "Takeout"}
                      </Badge>
                    </div>
                    <p className="text-sm font-body text-foreground">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">
                      {new Date(
                        Number(order.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PriceDisplay
                      cents={order.total}
                      className="text-primary font-body font-semibold"
                    />
                    <div className="flex gap-2">
                      <Link
                        to="/chat/$orderId"
                        params={{ orderId: order.id.toString() }}
                        data-ocid={`order.chat_button.${i + 1}`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 hover:text-primary transition-smooth"
                          title="Chat with chef"
                        >
                          <MessageCircleIcon className="w-4 h-4" />
                        </Button>
                      </Link>
                      {(order.status === "pending" ||
                        order.status === "confirmed") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs hover:bg-destructive/15 hover:text-destructive transition-smooth font-body"
                          onClick={() => cancelOrder.mutate(order.id)}
                          data-ocid={`order.cancel_button.${i + 1}`}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
