import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  FlameIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "../store/cartStore";
import type { MenuItem } from "../types";
import { DietaryBadge } from "./ui/DietaryBadge";
import { PriceDisplay } from "./ui/PriceDisplay";

interface MenuItemModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

export function MenuItemModal({ item, open, onClose }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  function handleAdd() {
    if (!item) return;
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    // Update instructions if provided
    if (instructions.trim()) {
      useCartStore.getState().updateInstructions(item.id, instructions);
    }
    toast.success(`${quantity}× ${item.name} added to order`, {
      description: instructions.trim() ? `Note: ${instructions}` : undefined,
      duration: 3000,
    });
    setQuantity(1);
    setInstructions("");
    onClose();
  }

  function handleClose(v: boolean) {
    if (!v) {
      setQuantity(1);
      setInstructions("");
      onClose();
    }
  }

  const totalPrice = item ? Number(item.price) * quantity : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-card border-white/10 max-w-md p-0 overflow-hidden rounded-2xl"
        data-ocid="menu.item_detail_dialog"
      >
        {item && (
          <>
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary/40 flex items-center justify-center">
                  <UtensilsCrossedIcon className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-black/30 to-transparent" />

              {/* Price badge on image */}
              <div className="absolute bottom-3 right-4">
                <PriceDisplay
                  cents={item.price}
                  className="text-xl font-body font-bold text-primary drop-shadow-lg"
                />
              </div>
            </div>

            <div className="px-5 pt-3 pb-5 space-y-4">
              <DialogHeader>
                <DialogTitle className="font-body font-bold text-lg text-foreground leading-snug">
                  {item.name}
                </DialogTitle>
              </DialogHeader>

              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Calories */}
              {item.calories != null && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                  <FlameIcon className="w-3.5 h-3.5 text-primary/60" />
                  <span>{Number(item.calories)} calories per serving</span>
                </div>
              )}

              {/* Dietary tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <DietaryBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="section-divider" />

              {/* Special instructions */}
              <div className="space-y-1.5">
                <label
                  htmlFor="menu-item-instructions"
                  className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  Special Instructions
                </label>
                <Textarea
                  id="menu-item-instructions"
                  placeholder="Allergies, preferences, substitutions…"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="bg-secondary/40 border-border/40 font-body text-sm resize-none h-20 focus:border-primary/40"
                  data-ocid="menu.item_instructions_textarea"
                />
              </div>

              {/* Quantity + Add */}
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center gap-0 border border-border/40 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="w-9 h-9 flex items-center justify-center hover:bg-white/8 transition-smooth text-muted-foreground hover:text-foreground"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    data-ocid="menu.item_qty_decrease_button"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="w-3.5 h-3.5" />
                  </button>
                  <span
                    className="w-10 text-center text-sm font-body font-semibold text-foreground"
                    data-ocid="menu.item_qty_display"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="w-9 h-9 flex items-center justify-center hover:bg-white/8 transition-smooth text-muted-foreground hover:text-foreground"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    data-ocid="menu.item_qty_increase_button"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart */}
                <Button
                  className="flex-1 gradient-gold-accent border-0 text-primary-foreground font-body font-semibold hover:opacity-90 transition-smooth shadow-gold-glow"
                  onClick={handleAdd}
                  data-ocid="menu.item_add_to_cart_button"
                >
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Add&nbsp;
                  <span className="text-primary-foreground/80 ml-1">
                    (<PriceDisplay cents={totalPrice} />)
                  </span>
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
