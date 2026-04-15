import { c as createLucideIcon, q as jsxRuntimeExports, y as Badge } from "./index-BMSJKAYU.js";
import { D as DietaryTag } from "./useQueries-O8-RsMEM.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
const DIETARY_CONFIG = {
  [DietaryTag.vegan]: {
    label: "Vegan",
    emoji: "🌱",
    className: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40"
  },
  [DietaryTag.vegetarian]: {
    label: "Vegetarian",
    emoji: "🥦",
    className: "bg-green-900/40 text-green-300 border-green-700/40"
  },
  [DietaryTag.glutenFree]: {
    label: "GF",
    emoji: "🌾",
    className: "bg-amber-900/40 text-amber-300 border-amber-700/40"
  },
  [DietaryTag.spicy]: {
    label: "Spicy",
    emoji: "🌶️",
    className: "bg-red-900/40 text-red-300 border-red-700/40"
  },
  [DietaryTag.chefsSpecial]: {
    label: "Chef's",
    emoji: "⭐",
    className: "bg-primary/20 text-primary border-primary/30"
  }
};
function DietaryBadge({ tag, className = "" }) {
  const config = DIETARY_CONFIG[tag];
  if (!config) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `text-xs px-1.5 py-0.5 font-body border ${config.className} ${className}`,
      children: [
        config.emoji,
        " ",
        config.label
      ]
    }
  );
}
export {
  DietaryBadge as D,
  Search as S
};
