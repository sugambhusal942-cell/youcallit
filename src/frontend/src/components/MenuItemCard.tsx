import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon, StarIcon, UtensilsCrossedIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useCartStore } from "../store/cartStore";
import type { MenuItem } from "../types";
import { DietaryBadge } from "./ui/DietaryBadge";
import { PriceDisplay } from "./ui/PriceDisplay";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onOpenModal: (item: MenuItem) => void;
}

export function MenuItemCard({ item, index, onOpenModal }: MenuItemCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTiltStyle({
      transform: `perspective(900px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale3d(1.025, 1.025, 1.025)`,
      transition: "transform 0.05s linear",
    });
  }

  function handleMouseLeave() {
    setTiltStyle({
      transform:
        "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)",
      transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      data-ocid={`menu.item.${index + 1}`}
    >
      <div
        ref={cardRef}
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group bg-card border border-white/8 rounded-2xl overflow-hidden hover:border-primary/30 shadow-luxury-sm hover:shadow-luxury flex flex-col h-full will-change-transform"
      >
        {/* Image Area */}
        <button
          type="button"
          className="relative block overflow-hidden bg-secondary/30 w-full"
          style={{ height: 196 }}
          onClick={() => onOpenModal(item)}
          data-ocid={`menu.item_image_button.${index + 1}`}
          aria-label={`View details for ${item.name}`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700 ease-out"
              style={{ transformOrigin: "center" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossedIcon className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* Hover shimmer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

          {/* Popular badge */}
          {item.isPopular && (
            <Badge className="absolute top-2.5 right-2.5 bg-primary/20 text-primary border border-primary/40 text-xs backdrop-blur-sm shadow-gold-glow">
              <StarIcon className="w-2.5 h-2.5 mr-1 fill-current" />
              Popular
            </Badge>
          )}

          {/* Price floating on image */}
          <div className="absolute bottom-2.5 right-2.5">
            <PriceDisplay
              cents={item.price}
              className="text-sm font-body font-bold text-primary bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-primary/25"
            />
          </div>
        </button>

        {/* Card Body */}
        <div className="p-4 flex flex-col flex-1">
          <button
            type="button"
            onClick={() => onOpenModal(item)}
            className="text-left mb-1.5"
            data-ocid={`menu.item_name_button.${index + 1}`}
          >
            <h3 className="font-body font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-smooth line-clamp-1">
              {item.name}
            </h3>
          </button>

          <p className="text-muted-foreground font-body text-xs line-clamp-2 mb-3 flex-1 leading-relaxed">
            {item.description}
          </p>

          {/* Calorie + dietary */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3 min-h-[22px]">
            {item.calories != null && (
              <span className="text-[10px] text-muted-foreground font-body bg-muted/50 px-1.5 py-0.5 rounded-md">
                {Number(item.calories)} cal
              </span>
            )}
            {item.tags.slice(0, 2).map((tag) => (
              <DietaryBadge key={tag} tag={tag} />
            ))}
            {item.tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground font-body">
                +{item.tags.length - 2}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            size="sm"
            className="w-full gradient-gold-accent border-0 text-primary-foreground text-xs font-body font-semibold hover:opacity-90 transition-smooth shadow-gold-glow group/btn"
            onClick={() => addItem(item)}
            data-ocid={`menu.add_to_cart_button.${index + 1}`}
          >
            <PlusIcon className="w-3.5 h-3.5 mr-1.5 group-hover/btn:rotate-90 transition-smooth" />
            Add to Order
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
