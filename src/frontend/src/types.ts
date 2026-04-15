import type {
  ChatMessage,
  ChatThread,
  CustomerProfile,
  DietaryTag,
  MenuCategory,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  Reservation,
  ReservationStatus,
  SenderRole,
  Table,
  TableStatus,
} from "./backend";

// Re-export all backend types for convenience
export type {
  MenuCategory,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  Reservation,
  ReservationStatus,
  Table,
  TableStatus,
  ChatMessage,
  ChatThread,
  CustomerProfile,
  DietaryTag,
  SenderRole,
};

// Cart types (local state only)
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  addItem: (item: MenuItem, qty?: number) => void;
  removeItem: (menuItemId: bigint) => void;
  updateQuantity: (menuItemId: bigint, qty: number) => void;
  updateInstructions: (menuItemId: bigint, instructions: string) => void;
  clearCart: () => void;
  totalItems: number;
}

// UI helper types
export type TabValue = "menu" | "reservations" | "orders" | "chat" | "account";

export interface DietaryInfo {
  tag: DietaryTag;
  label: string;
  color: string;
  emoji: string;
}
