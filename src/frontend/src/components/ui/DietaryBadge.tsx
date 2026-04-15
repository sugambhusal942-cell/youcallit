import { Badge } from "@/components/ui/badge";
import { DietaryTag } from "../../backend";

interface DietaryBadgeProps {
  tag: DietaryTag;
  className?: string;
}

const DIETARY_CONFIG: Record<
  DietaryTag,
  { label: string; emoji: string; className: string }
> = {
  [DietaryTag.vegan]: {
    label: "Vegan",
    emoji: "🌱",
    className: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  },
  [DietaryTag.vegetarian]: {
    label: "Vegetarian",
    emoji: "🥦",
    className: "bg-green-900/40 text-green-300 border-green-700/40",
  },
  [DietaryTag.glutenFree]: {
    label: "GF",
    emoji: "🌾",
    className: "bg-amber-900/40 text-amber-300 border-amber-700/40",
  },
  [DietaryTag.spicy]: {
    label: "Spicy",
    emoji: "🌶️",
    className: "bg-red-900/40 text-red-300 border-red-700/40",
  },
  [DietaryTag.chefsSpecial]: {
    label: "Chef's",
    emoji: "⭐",
    className: "bg-primary/20 text-primary border-primary/30",
  },
};

export function DietaryBadge({ tag, className = "" }: DietaryBadgeProps) {
  const config = DIETARY_CONFIG[tag];
  if (!config) return null;
  return (
    <Badge
      variant="outline"
      className={`text-xs px-1.5 py-0.5 font-body border ${config.className} ${className}`}
    >
      {config.emoji} {config.label}
    </Badge>
  );
}
