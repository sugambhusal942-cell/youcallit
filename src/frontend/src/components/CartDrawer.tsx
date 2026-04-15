import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNavigate } from "@tanstack/react-router";
import { MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore } from "../store/cartStore";
import { PriceDisplay } from "./ui/PriceDisplay";

const TAX_RATE = 0.08;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, subtotal, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const navigate = useNavigate();

  // subtotal from store is in dollars (not cents). Prices stored as cents in backend.
  // menuItem.price is in cents (bigint), subtotal computed as Number(price) * qty
  // So subtotal is raw cents-sum. Tax and total are in same unit.
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + tax;

  const handleCheckout = () => {
    onClose();
    navigate({ to: "/order" });
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] bg-card border-l border-border flex flex-col p-0"
        data-ocid="cart.sheet"
      >
        <SheetHeader className="px-6 py-5 border-b border-border flex-shrink-0">
          <SheetTitle className="font-display italic text-xl text-gradient-gold flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-primary" />
            Your Order
            {items.length > 0 && (
              <span className="ml-auto text-sm font-body font-normal text-muted-foreground">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center min-h-64 gap-4 py-16 px-6"
              data-ocid="cart.empty_state"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"
              >
                <ShoppingBagIcon className="w-8 h-8 text-muted-foreground/40" />
              </motion.div>
              <p className="text-muted-foreground font-body text-center text-sm">
                Your cart is empty
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-border/40 hover:border-primary/40 text-sm"
                onClick={() => {
                  onClose();
                  navigate({ to: "/menu" });
                }}
                data-ocid="cart.browse_menu_button"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-2 px-4 py-3" data-ocid="cart.items_list">
                {items.map((item, index) => (
                  <motion.div
                    key={item.menuItem.id.toString()}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="flex gap-3 bg-background rounded-xl p-3 border border-border"
                    data-ocid={`cart.item.${index + 1}`}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      {item.menuItem.imageUrl ? (
                        <img
                          src={item.menuItem.imageUrl}
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-foreground text-sm truncate">
                        {item.menuItem.name}
                      </p>
                      <PriceDisplay
                        cents={item.menuItem.price}
                        className="text-xs text-primary font-body mt-0.5"
                      />

                      {/* Qty controls */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          type="button"
                          className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth"
                          onClick={() =>
                            updateQuantity(item.menuItem.id, item.quantity - 1)
                          }
                          data-ocid={`cart.decrease_button.${index + 1}`}
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-body">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-smooth"
                          onClick={() =>
                            updateQuantity(item.menuItem.id, item.quantity + 1)
                          }
                          data-ocid={`cart.increase_button.${index + 1}`}
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line total + remove */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive transition-smooth p-0.5"
                        onClick={() => removeItem(item.menuItem.id)}
                        data-ocid={`cart.remove_button.${index + 1}`}
                      >
                        <Trash2Icon className="w-3.5 h-3.5" />
                      </button>
                      <PriceDisplay
                        cents={BigInt(
                          Math.round(
                            Number(item.menuItem.price) * item.quantity,
                          ),
                        )}
                        className="text-sm font-semibold text-foreground"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="flex-shrink-0 px-6 py-5 border-t border-border space-y-3 bg-card">
            {/* Totals */}
            <div className="space-y-1.5 text-sm font-body">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <PriceDisplay cents={subtotal} className="text-foreground" />
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (8%)</span>
                <PriceDisplay cents={tax} className="text-foreground" />
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-semibold text-base">
                <span className="text-foreground">Total</span>
                <PriceDisplay cents={grandTotal} className="text-primary" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-border/40 text-sm font-body"
                onClick={clearCart}
                data-ocid="cart.clear_button"
              >
                Clear
              </Button>
              <Button
                className="flex-[2] gradient-gold-accent border-0 text-primary-foreground font-body text-sm hover:opacity-90 transition-smooth shadow-gold-glow"
                onClick={handleCheckout}
                data-ocid="cart.checkout_button"
              >
                Proceed to Order
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
