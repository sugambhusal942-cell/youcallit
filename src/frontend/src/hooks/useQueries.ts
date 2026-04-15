import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DietaryTag,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  Reservation,
  ReservationStatus,
} from "../backend";
import { useActor } from "./useActor";

// ─── Menu ──────────────────────────────────────────────────────────────────

export function useMenuCategories() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["menuCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMenuItemsByCategory(categoryId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["menuItemsByCategory", categoryId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItemsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMenuItem(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["menuItem", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMenuItem(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchMenuItems(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["searchMenuItems", searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      return actor.searchMenuItems(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

// ─── Orders ────────────────────────────────────────────────────────────────

export function useCustomerOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["customerOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrder(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["order", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      items,
      orderType,
      specialInstructions,
      tableNumber,
    }: {
      items: OrderItem[];
      orderType: OrderType;
      specialInstructions: string;
      tableNumber: bigint | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(
        items,
        orderType,
        specialInstructions,
        tableNumber,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerOrders"] });
    },
  });
}

export function useCancelOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelOrder(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerOrders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

// ─── Reservations ──────────────────────────────────────────────────────────

export function useCustomerReservations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["customerReservations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerReservations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllReservations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allReservations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReservations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTables() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allTables"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTables();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAvailableTables(
  date: string,
  time: string,
  guestCount: bigint,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["availableTables", date, time, guestCount.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableTables(date, time, guestCount);
    },
    enabled: !!actor && !isFetching && !!date && !!time && guestCount > 0n,
  });
}

export function useMakeReservation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      tableId: bigint;
      guestCount: bigint;
      date: string;
      time: string;
      customerName: string;
      phone: string;
      email: string;
      specialOccasion: string | null;
      notes: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.makeReservation(
        params.tableId,
        params.guestCount,
        params.date,
        params.time,
        params.customerName,
        params.phone,
        params.email,
        params.specialOccasion,
        params.notes,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerReservations"] });
      qc.invalidateQueries({ queryKey: ["availableTables"] });
    },
  });
}

export function useCancelReservation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelReservation(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerReservations"] });
    },
  });
}

export function useUpdateReservationStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: ReservationStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateReservationStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allReservations"] });
    },
  });
}

// ─── Chat ──────────────────────────────────────────────────────────────────

export function useThread(orderId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["thread", orderId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getThreadByOrder(orderId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useAllOpenThreads() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allOpenThreads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOpenThreads();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      content,
    }: { orderId: bigint; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage(orderId, content);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["thread", vars.orderId.toString()] });
    },
  });
}

export function useSendChefMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      content,
    }: { orderId: bigint; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendChefMessage(orderId, content);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["thread", vars.orderId.toString()] });
      qc.invalidateQueries({ queryKey: ["allOpenThreads"] });
    },
  });
}

// ─── Profile ───────────────────────────────────────────────────────────────

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      email,
      dietaryPreferences,
    }: {
      name: string;
      phone: string;
      email: string;
      dietaryPreferences: DietaryTag[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProfile(name, phone, email, dietaryPreferences);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (menuItemId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFavoriteItem(menuItemId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (menuItemId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeFavoriteItem(menuItemId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export function useAddMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      categoryId: bigint;
      name: string;
      description: string;
      price: bigint;
      imageUrl: string;
      tags: DietaryTag[];
      calories: bigint | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMenuItem(
        params.categoryId,
        params.name,
        params.description,
        params.price,
        params.imageUrl,
        params.tags,
        params.calories,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: MenuItem) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMenuItem(item);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useToggleItemAvailability() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleItemAvailability(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useGetAllCustomers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrdersByStatus(status: OrderStatus) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["ordersByStatus", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrdersByStatus(status);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useUpdateTableStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: import("../backend").TableStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTableStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allTables"] });
    },
  });
}
