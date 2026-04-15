import { create } from "zustand";
import type { MenuItem } from "../backend";
import type { CartItem, CartState } from "../types";

function computeSubtotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + Number(item.menuItem.price) * item.quantity,
    0,
  );
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  totalItems: 0,

  addItem: (menuItem: MenuItem, qty = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.menuItem.id === menuItem.id);
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      } else {
        items = [
          ...state.items,
          { menuItem, quantity: qty, specialInstructions: "" },
        ];
      }
      return {
        items,
        subtotal: computeSubtotal(items),
        totalItems: items.reduce((s, i) => s + i.quantity, 0),
      };
    });
  },

  removeItem: (menuItemId: bigint) => {
    set((state) => {
      const items = state.items.filter((i) => i.menuItem.id !== menuItemId);
      return {
        items,
        subtotal: computeSubtotal(items),
        totalItems: items.reduce((s, i) => s + i.quantity, 0),
      };
    });
  },

  updateQuantity: (menuItemId: bigint, qty: number) => {
    if (qty <= 0) {
      get().removeItem(menuItemId);
      return;
    }
    set((state) => {
      const items = state.items.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, quantity: qty } : i,
      );
      return {
        items,
        subtotal: computeSubtotal(items),
        totalItems: items.reduce((s, i) => s + i.quantity, 0),
      };
    });
  },

  updateInstructions: (menuItemId: bigint, instructions: string) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItem.id === menuItemId
          ? { ...i, specialInstructions: instructions }
          : i,
      ),
    }));
  },

  clearCart: () => set({ items: [], subtotal: 0, totalItems: 0 }),
}));
