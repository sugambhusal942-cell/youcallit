import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  ChefHat,
  Edit2,
  Heart,
  LogIn,
  MessageCircle,
  RotateCcw,
  Save,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { DietaryTag } from "../backend";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  useCancelReservation,
  useCustomerOrders,
  useCustomerReservations,
  useMenuItems,
  useMyProfile,
  useRemoveFavorite,
  useUpdateProfile,
} from "../hooks/useQueries";
import { useCartStore } from "../store/cartStore";
import type { MenuItem, Order, Reservation } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const DIETARY_OPTIONS: { tag: DietaryTag; label: string; emoji: string }[] = [
  { tag: DietaryTag.vegan, label: "Vegan", emoji: "🌿" },
  { tag: DietaryTag.vegetarian, label: "Vegetarian", emoji: "🥦" },
  { tag: DietaryTag.glutenFree, label: "Gluten-Free", emoji: "🌾" },
  { tag: DietaryTag.spicy, label: "Spicy Lover", emoji: "🌶️" },
];

const ACTIVE_ORDER_STATUSES = new Set([
  "pending",
  "confirmed",
  "preparing",
  "ready",
]);

type TabId = "orders" | "reservations" | "favorites";

// ─── Login Gate ───────────────────────────────────────────────────────────────

function LoginGate() {
  const { login } = useInternetIdentity();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center"
      data-ocid="account.sign_in_panel"
    >
      <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center shadow-gold-glow">
        <User className="w-9 h-9 text-accent-gold" />
      </div>
      <div>
        <h1 className="font-display text-3xl italic text-foreground mb-3">
          Your <span className="text-gradient-gold">Dining Concierge</span>
        </h1>
        <p className="text-muted-foreground font-body max-w-md leading-relaxed">
          Sign in with Internet Identity to access your profile, track orders,
          manage reservations, and save your favourite dishes.
        </p>
      </div>
      <Button
        data-ocid="account.sign_in_button"
        onClick={() => login()}
        className="gap-2 px-8 py-5 text-base font-body gradient-gold-accent text-primary-foreground hover:opacity-90 transition-smooth rounded-xl shadow-gold-glow border-0"
      >
        <LogIn className="w-5 h-5" />
        Sign In with Internet Identity
      </Button>
    </motion.div>
  );
}

// ─── Avatar Initials ──────────────────────────────────────────────────────────

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-20 h-20 rounded-full gradient-gold-accent flex items-center justify-center shadow-gold-glow flex-shrink-0">
      <span className="font-display text-2xl text-primary-foreground">
        {initials || "YC"}
      </span>
    </div>
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────

interface ProfileCardProps {
  name: string;
  phone: string;
  email: string;
  dietaryPreferences: DietaryTag[];
  onSave: (data: {
    name: string;
    phone: string;
    email: string;
    dietaryPreferences: DietaryTag[];
  }) => void;
  isSaving: boolean;
}

function ProfileCard({
  name,
  phone,
  email,
  dietaryPreferences,
  onSave,
  isSaving,
}: ProfileCardProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name, phone, email });
  const [selectedDietary, setSelectedDietary] =
    useState<DietaryTag[]>(dietaryPreferences);

  function toggleDietary(tag: DietaryTag) {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((d) => d !== tag) : [...prev, tag],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, dietaryPreferences: selectedDietary });
    setEditing(false);
  }

  function startEditing() {
    setForm({ name, phone, email });
    setSelectedDietary(dietaryPreferences);
    setEditing(true);
  }

  return (
    <div
      className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden"
      data-ocid="account.profile_panel"
    >
      <div className="h-1 gradient-gold-accent" />
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-5 mb-6">
          <AvatarInitials name={name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl italic text-foreground truncate">
                  {name || "Valued Guest"}
                </h2>
                <p className="text-sm text-muted-foreground font-body mt-0.5">
                  Dining Concierge Member
                </p>
              </div>
              {!editing && (
                <Button
                  data-ocid="account.edit_button"
                  variant="outline"
                  size="sm"
                  onClick={startEditing}
                  className="gap-1.5 border-border hover:border-primary/50 transition-smooth flex-shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {editing ? (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="acc-name"
                    className="text-sm text-muted-foreground font-body"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="acc-name"
                    data-ocid="account.name_input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-background border-border focus:border-primary/60 font-body"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="acc-phone"
                    className="text-sm text-muted-foreground font-body"
                  >
                    Phone
                  </Label>
                  <Input
                    id="acc-phone"
                    type="tel"
                    data-ocid="account.phone_input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="bg-background border-border focus:border-primary/60 font-body"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="acc-email"
                    className="text-sm text-muted-foreground font-body"
                  >
                    Email
                  </Label>
                  <Input
                    id="acc-email"
                    type="email"
                    data-ocid="account.email_input"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="bg-background border-border focus:border-primary/60 font-body"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground font-body">
                  Dietary Preferences
                </Label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((opt) => {
                    const active = selectedDietary.includes(opt.tag);
                    return (
                      <button
                        key={opt.tag}
                        type="button"
                        data-ocid={`account.dietary_${opt.tag}`}
                        onClick={() => toggleDietary(opt.tag)}
                        className={`px-4 py-1.5 rounded-full text-sm font-body border transition-smooth flex items-center gap-1.5 ${
                          active
                            ? "border-primary/60 bg-primary/10 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <span aria-hidden="true">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  data-ocid="account.save_button"
                  disabled={isSaving}
                  className="gap-2 gradient-gold-accent text-primary-foreground hover:opacity-90 transition-smooth border-0"
                >
                  {isSaving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="account.cancel_button"
                  onClick={() => setEditing(false)}
                  className="gap-2 border-border hover:border-primary/40 transition-smooth"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Phone", value: phone || "Not provided" },
                  { label: "Email", value: email || "Not provided" },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="bg-background/60 rounded-xl px-4 py-3 border border-border"
                  >
                    <p className="text-xs text-muted-foreground font-body mb-0.5">
                      {field.label}
                    </p>
                    <p className="text-sm text-foreground font-body truncate">
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
              {dietaryPreferences.length > 0 ? (
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-2">
                    Dietary Preferences
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dietaryPreferences.map((tag) => {
                      const opt = DIETARY_OPTIONS.find((o) => o.tag === tag);
                      return opt ? (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-body border border-primary/40 bg-primary/10 text-foreground flex items-center gap-1"
                        >
                          <span aria-hidden="true">{opt.emoji}</span>{" "}
                          {opt.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-body italic">
                  No dietary preferences set — click Edit to personalise your
                  experience.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({ orders }: { orders: Order[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const { data: menuItems } = useMenuItems();
  const navigate = useNavigate();

  function handleReorder(order: Order) {
    if (!menuItems) return;
    let addedCount = 0;
    for (const oi of order.items) {
      const item = menuItems.find((m) => m.id === oi.menuItemId);
      if (item) {
        addItem(item, Number(oi.quantity));
        addedCount++;
      }
    }
    if (addedCount > 0) {
      toast.success("Items added to cart", {
        description: `${addedCount} item(s) added — head to checkout when ready.`,
      });
      navigate({ to: "/order" });
    } else {
      toast.error("Could not reorder — items may no longer be available.");
    }
  }

  if (orders.length === 0) {
    return (
      <div
        data-ocid="account.orders.empty_state"
        className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
          <ShoppingCart className="w-7 h-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-foreground font-body font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Your order history will appear here after your first visit.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/menu" })}
          className="border-border hover:border-primary/50 transition-smooth mt-2"
        >
          Browse the Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order, idx) => {
        const isActive = ACTIVE_ORDER_STATUSES.has(order.status);
        const date = new Date(Number(order.createdAt) / 1_000_000);
        return (
          <motion.div
            key={order.id.toString()}
            data-ocid={`account.orders.item.${idx + 1}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-primary/30 transition-smooth"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono text-muted-foreground">
                  #{order.id.toString().padStart(4, "0")}
                </span>
                <StatusBadge status={order.status} />
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                    aria-label="Active order"
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground font-body">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {order.items.length} item
                {order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <PriceDisplay
                cents={order.total}
                className="text-sm font-body font-medium text-accent-gold"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid={`account.orders.chat.${idx + 1}`}
                  onClick={() =>
                    navigate({
                      to: "/chat/$orderId",
                      params: { orderId: order.id.toString() },
                    })
                  }
                  className="gap-1.5 border-border hover:border-primary/50 text-xs transition-smooth"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chef</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                data-ocid={`account.orders.reorder.${idx + 1}`}
                onClick={() => handleReorder(order)}
                className="gap-1.5 border-border hover:border-primary/50 text-xs transition-smooth"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reorder</span>
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Reservations Tab ─────────────────────────────────────────────────────────

function ReservationsTab({
  reservations,
}: {
  reservations: Reservation[];
}) {
  const cancelReservation = useCancelReservation();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  function handleCancel(id: bigint) {
    cancelReservation.mutate(id, {
      onSuccess: () =>
        toast.success("Reservation cancelled", {
          description:
            "We hope to welcome you again soon — book a new table anytime.",
        }),
      onError: () => toast.error("Could not cancel reservation"),
    });
  }

  if (reservations.length === 0) {
    return (
      <div
        data-ocid="account.reservations.empty_state"
        className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
          <CalendarDays className="w-7 h-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-foreground font-body font-medium">
            No reservations yet
          </p>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Book a table and your reservations will appear here.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/reservations" })}
          className="border-border hover:border-primary/50 transition-smooth mt-2"
        >
          Reserve a Table
        </Button>
      </div>
    );
  }

  const sorted = [...reservations].sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <div className="space-y-3">
      {sorted.map((res, idx) => {
        const upcoming = res.status !== "cancelled" && res.date >= today;
        return (
          <motion.div
            key={res.id.toString()}
            data-ocid={`account.reservations.item.${idx + 1}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-primary/30 transition-smooth"
          >
            <div className="w-12 h-12 rounded-xl bg-background border border-border flex-shrink-0 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-accent-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-sm font-body text-foreground">
                  {new Date(`${res.date}T00:00:00`).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </span>
                <span className="text-xs text-muted-foreground font-body">
                  {res.time}
                </span>
                <StatusBadge status={res.status} />
              </div>
              <p className="text-sm text-muted-foreground font-body truncate">
                Table {res.tableId.toString()} · {res.guestCount.toString()}{" "}
                guest
                {res.guestCount !== 1n ? "s" : ""}
                {res.specialOccasion ? ` · ${res.specialOccasion}` : ""}
              </p>
            </div>
            {upcoming && (
              <Button
                variant="outline"
                size="sm"
                data-ocid={`account.reservations.cancel.${idx + 1}`}
                onClick={() => handleCancel(res.id)}
                disabled={cancelReservation.isPending}
                className="gap-1.5 border-border hover:border-destructive/50 hover:text-destructive text-xs flex-shrink-0 transition-smooth"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Favorites Tab ────────────────────────────────────────────────────────────

function FavoritesTab({
  favoriteIds,
  allItems,
}: {
  favoriteIds: bigint[];
  allItems: MenuItem[];
}) {
  const addToCart = useCartStore((s) => s.addItem);
  const removeFavorite = useRemoveFavorite();

  const favorites = allItems.filter((item) =>
    favoriteIds.some((fid) => fid === item.id),
  );

  if (favorites.length === 0) {
    return (
      <div
        data-ocid="account.favorites.empty_state"
        className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
          <Heart className="w-7 h-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-foreground font-body font-medium">
            No favourites saved
          </p>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Tap the heart on any dish to save it here for quick access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((item, idx) => (
        <motion.div
          key={item.id.toString()}
          data-ocid={`account.favorites.item.${idx + 1}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth group shadow-luxury-sm"
        >
          <div className="relative h-40 overflow-hidden bg-muted">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <button
              type="button"
              data-ocid={`account.favorites.remove.${idx + 1}`}
              onClick={() => removeFavorite.mutate(item.id)}
              aria-label="Remove from favourites"
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:border-destructive/50 hover:text-destructive transition-smooth"
            >
              <Heart className="w-4 h-4 fill-primary text-primary" />
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-display italic text-base text-foreground mb-1 truncate">
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground font-body line-clamp-2 mb-3">
              {item.description}
            </p>
            <div className="flex items-center justify-between">
              <PriceDisplay
                cents={item.price}
                className="text-sm font-body font-medium text-accent-gold"
              />
              <Button
                size="sm"
                data-ocid={`account.favorites.add_to_cart.${idx + 1}`}
                onClick={() => {
                  addToCart(item);
                  toast.success(`${item.name} added to cart`);
                }}
                className="gap-1.5 gradient-gold-accent text-primary-foreground hover:opacity-90 transition-smooth text-xs border-0"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

function SignOutButton() {
  const { clear } = useInternetIdentity();
  return (
    <button
      type="button"
      data-ocid="account.signout_button"
      onClick={() => clear()}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body transition-smooth group"
    >
      <span className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-destructive/40 group-hover:text-destructive transition-smooth">
        <LogIn className="w-3 h-3 rotate-180" />
      </span>
      Sign Out
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const { isAuthenticated } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: rawOrders = [], isLoading: ordersLoading } =
    useCustomerOrders();
  const { data: rawReservations = [], isLoading: resLoading } =
    useCustomerReservations();
  const { data: allItems = [] } = useMenuItems();
  const updateProfile = useUpdateProfile();
  const [activeTab, setActiveTab] = useState<TabId>("orders");

  if (!isAuthenticated) return <LoginGate />;
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner label="Loading your profile…" />
      </div>
    );
  }

  const orders = rawOrders as Order[];
  const reservations = rawReservations as Reservation[];
  const items = allItems as MenuItem[];

  const currentProfile = profile ?? {
    name: "",
    phone: "",
    email: "",
    dietaryPreferences: [] as DietaryTag[],
    favoriteItems: [] as bigint[],
  };

  function handleProfileSave(data: {
    name: string;
    phone: string;
    email: string;
    dietaryPreferences: DietaryTag[];
  }) {
    updateProfile.mutate(data, {
      onSuccess: () =>
        toast.success("Profile saved", {
          description: "Your dining concierge profile has been updated.",
        }),
      onError: () => toast.error("Failed to save profile — please try again."),
    });
  }

  const TABS: {
    id: TabId;
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart className="w-4 h-4" />,
      count: orders.length,
    },
    {
      id: "reservations",
      label: "Reservations",
      icon: <CalendarDays className="w-4 h-4" />,
      count: reservations.length,
    },
    {
      id: "favorites",
      label: "Favourites",
      icon: <Heart className="w-4 h-4" />,
      count: currentProfile.favoriteItems.length,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="h-px flex-1 section-divider" />
        <h1 className="font-display italic text-lg text-muted-foreground px-2 flex-shrink-0">
          My Account
        </h1>
        <div className="h-px flex-1 section-divider" />
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <ProfileCard
          name={currentProfile.name}
          phone={currentProfile.phone}
          email={currentProfile.email}
          dietaryPreferences={currentProfile.dietaryPreferences}
          onSave={handleProfileSave}
          isSaving={updateProfile.isPending}
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-5"
      >
        {/* Tab bar */}
        <div
          data-ocid="account.tabs"
          className="flex gap-1 bg-card border border-border rounded-xl p-1"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`account.tab.${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-body transition-smooth ${
                activeTab === tab.id
                  ? "gradient-gold-accent text-primary-foreground shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                    activeTab === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "orders" && (
                <div data-ocid="account.orders.panel">
                  {ordersLoading ? (
                    <div
                      data-ocid="account.orders.loading_state"
                      className="flex items-center justify-center py-20"
                    >
                      <LoadingSpinner label="Loading orders…" />
                    </div>
                  ) : (
                    <OrdersTab orders={orders} />
                  )}
                </div>
              )}
              {activeTab === "reservations" && (
                <div data-ocid="account.reservations.panel">
                  {resLoading ? (
                    <div
                      data-ocid="account.reservations.loading_state"
                      className="flex items-center justify-center py-20"
                    >
                      <LoadingSpinner label="Loading reservations…" />
                    </div>
                  ) : (
                    <ReservationsTab reservations={reservations} />
                  )}
                </div>
              )}
              {activeTab === "favorites" && (
                <div data-ocid="account.favorites.panel">
                  <FavoritesTab
                    favoriteIds={currentProfile.favoriteItems}
                    allItems={items}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end pt-2 border-t border-border/40"
      >
        <SignOutButton />
      </motion.div>
    </div>
  );
}
