import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface MenuCategory {
    id: bigint;
    name: string;
    description: string;
    emoji: string;
}
export interface OrderItem {
    specialInstructions: string;
    quantity: bigint;
    menuItemId: bigint;
}
export interface Reservation {
    id: bigint;
    customerName: string;
    status: ReservationStatus;
    specialOccasion?: string;
    date: string;
    guestCount: bigint;
    time: string;
    tableId: bigint;
    email: string;
    notes?: string;
    customerId: UserId;
    phone: string;
}
export interface CustomerProfile {
    id: UserId;
    dietaryPreferences: Array<DietaryTag>;
    name: string;
    favoriteItems: Array<bigint>;
    email: string;
    phone: string;
}
export interface Order {
    id: bigint;
    tax: bigint;
    status: OrderStatus;
    total: bigint;
    createdAt: Timestamp;
    tableNumber?: bigint;
    orderType: OrderType;
    specialInstructions: string;
    customerId: UserId;
    items: Array<OrderItem>;
    subtotal: bigint;
}
export type UserId = Principal;
export interface MenuItem {
    id: bigint;
    categoryId: bigint;
    calories?: bigint;
    name: string;
    tags: Array<DietaryTag>;
    isAvailable: boolean;
    description: string;
    isPopular: boolean;
    imageUrl: string;
    price: bigint;
}
export interface ChatThread {
    id: bigint;
    messages: Array<ChatMessage>;
    lastActivity: Timestamp;
    isOpen: boolean;
    orderId: bigint;
    customerId: UserId;
}
export interface Table {
    x: bigint;
    y: bigint;
    id: bigint;
    status: TableStatus;
    number: bigint;
    capacity: bigint;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    isRead: boolean;
    orderId?: bigint;
    timestamp: Timestamp;
    senderRole: SenderRole;
    senderId: UserId;
    reservationId?: bigint;
}
export enum DietaryTag {
    chefsSpecial = "chefsSpecial",
    vegan = "vegan",
    glutenFree = "glutenFree",
    spicy = "spicy",
    vegetarian = "vegetarian"
}
export enum OrderStatus {
    preparing = "preparing",
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed",
    ready = "ready"
}
export enum OrderType {
    takeout = "takeout",
    dineIn = "dineIn"
}
export enum ReservationStatus {
    cancelled = "cancelled",
    pending = "pending",
    confirmed = "confirmed"
}
export enum SenderRole {
    customer = "customer",
    chef = "chef"
}
export enum TableStatus {
    occupied = "occupied",
    reserved = "reserved",
    available = "available",
    maintenance = "maintenance"
}
export interface backendInterface {
    addFavoriteItem(menuItemId: bigint): Promise<boolean>;
    addMenuCategory(name: string, description: string, emoji: string): Promise<MenuCategory>;
    addMenuItem(categoryId: bigint, name: string, description: string, price: bigint, imageUrl: string, tags: Array<DietaryTag>, calories: bigint | null): Promise<MenuItem>;
    cancelOrder(id: bigint): Promise<boolean>;
    cancelReservation(id: bigint): Promise<boolean>;
    deleteMenuItem(id: bigint): Promise<boolean>;
    getAllCustomers(): Promise<Array<CustomerProfile>>;
    getAllOpenThreads(): Promise<Array<ChatThread>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllReservations(): Promise<Array<Reservation>>;
    getAllTables(): Promise<Array<Table>>;
    getAvailableTables(date: string, time: string, guestCount: bigint): Promise<Array<Table>>;
    getCustomerOrders(): Promise<Array<Order>>;
    getCustomerReservations(): Promise<Array<Reservation>>;
    getMenuCategories(): Promise<Array<MenuCategory>>;
    getMenuItem(id: bigint): Promise<MenuItem | null>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(categoryId: bigint): Promise<Array<MenuItem>>;
    getMyProfile(): Promise<CustomerProfile | null>;
    getNewMessages(threadId: bigint, lastMessageId: bigint): Promise<Array<ChatMessage>>;
    getOrder(id: bigint): Promise<Order | null>;
    getOrdersByStatus(status: OrderStatus): Promise<Array<Order>>;
    getReservation(id: bigint): Promise<Reservation | null>;
    getThread(threadId: bigint): Promise<ChatThread | null>;
    getThreadByOrder(orderId: bigint): Promise<ChatThread | null>;
    makeReservation(tableId: bigint, guestCount: bigint, date: string, time: string, customerName: string, phone: string, email: string, specialOccasion: string | null, notes: string | null): Promise<Reservation>;
    markMessagesRead(threadId: bigint): Promise<boolean>;
    modifyReservation(updated: Reservation): Promise<boolean>;
    placeOrder(items: Array<OrderItem>, orderType: OrderType, specialInstructions: string, tableNumber: bigint | null): Promise<Order>;
    removeFavoriteItem(menuItemId: bigint): Promise<boolean>;
    searchMenuItems(searchTerm: string): Promise<Array<MenuItem>>;
    sendChefMessage(orderId: bigint, content: string): Promise<ChatMessage>;
    sendMessage(orderId: bigint, content: string): Promise<ChatMessage>;
    toggleItemAvailability(id: bigint): Promise<boolean>;
    updateMenuItem(item: MenuItem): Promise<boolean>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<boolean>;
    updateProfile(name: string, phone: string, email: string, dietaryPreferences: Array<DietaryTag>): Promise<CustomerProfile>;
    updateReservationStatus(id: bigint, status: ReservationStatus): Promise<boolean>;
    updateTableStatus(id: bigint, status: TableStatus): Promise<boolean>;
}
