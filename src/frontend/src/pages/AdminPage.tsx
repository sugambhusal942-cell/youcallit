import {
  BarChart3,
  Calendar,
  ChefHat,
  LayoutDashboard,
  Lock,
  MessageSquare,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AnalyticsPanel } from "../components/admin/AnalyticsPanel";
import { ChefChatPanel } from "../components/admin/ChefChatPanel";
import { MenuManager } from "../components/admin/MenuManager";
import { OrdersQueue } from "../components/admin/OrdersQueue";
import { ReservationsPanel } from "../components/admin/ReservationsPanel";

type AdminTab = "orders" | "reservations" | "menu" | "chat" | "analytics";

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "analytics",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  {
    id: "reservations",
    label: "Reservations",
    icon: <Calendar className="w-4 h-4" />,
  },
  { id: "menu", label: "Menu", icon: <UtensilsCrossed className="w-4 h-4" /> },
  {
    id: "chat",
    label: "Chef Chat",
    icon: <MessageSquare className="w-4 h-4" />,
  },
];

const ADMIN_PIN = "chef2024";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[80vh] flex items-center justify-center"
        data-ocid="admin.login_gate"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display italic text-2xl text-foreground mb-1">
              Chef Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              youCallIT Kitchen Command Center
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Enter admin PIN"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError(false);
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth ${pinError ? "border-destructive" : "border-border"}`}
                  data-ocid="admin.pin_input"
                />
              </div>
              {pinError && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="admin.pin_error"
                >
                  Incorrect PIN. Please try again.
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-smooth"
                data-ocid="admin.login_button"
              >
                Enter Kitchen
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              Demo PIN: chef2024
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="flex h-[calc(100vh-4rem)] overflow-hidden"
      data-ocid="admin.page"
    >
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-card border-r border-border flex flex-col py-6 gap-1">
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-display italic text-lg text-foreground">
              Admin
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            youCallIT Kitchen
          </p>
        </div>

        <nav className="flex flex-col gap-1 px-2 flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth text-left w-full ${
                activeTab === tab.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              data-ocid={`admin.tab.${tab.id}`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="admin-tab-bg"
                  className="absolute inset-0 rounded-xl bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 pb-2">
          <div className="section-divider mb-3" />
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-smooth w-full text-left"
            data-ocid="admin.logout_button"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="h-full"
          >
            {activeTab === "analytics" && <AnalyticsPanel />}
            {activeTab === "orders" && <OrdersQueue />}
            {activeTab === "reservations" && <ReservationsPanel />}
            {activeTab === "menu" && <MenuManager />}
            {activeTab === "chat" && <ChefChatPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
