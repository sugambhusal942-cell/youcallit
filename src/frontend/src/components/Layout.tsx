import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CalendarIcon,
  ChefHatIcon,
  ClipboardListIcon,
  HomeIcon,
  MenuIcon,
  MessageCircleIcon,
  ShoppingCartIcon,
  UserIcon,
  UtensilsCrossedIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { CartDrawer } from "./CartDrawer";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/menu", label: "Menu", icon: UtensilsCrossedIcon },
  { to: "/reservations", label: "Reservations", icon: CalendarIcon },
  { to: "/order", label: "My Orders", icon: ClipboardListIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated, login, clear } = useInternetIdentity();
  const totalItems = useCartStore((s) => s.totalItems);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Navigation */}
      <header
        className="sticky top-0 z-50 nav-blur border-b border-white/5 shadow-luxury-sm"
        data-ocid="nav.header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              data-ocid="nav.logo_link"
            >
              <ChefHatIcon className="w-6 h-6 text-primary transition-smooth group-hover:rotate-12" />
              <span className="font-display italic text-2xl text-gradient-gold tracking-tight">
                youCallIT
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              data-ocid="nav.links"
            >
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-smooth ${
                    isActive(to)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                  data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}_link`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-white/8 transition-smooth"
                onClick={() => setCartOpen(true)}
                data-ocid="nav.cart_button"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground border-0 rounded-full">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Auth Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to="/account" data-ocid="nav.account_link">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-white/8 transition-smooth"
                    >
                      <UserIcon className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex border-border/40 hover:border-border text-sm font-body transition-smooth"
                    onClick={clear}
                    data-ocid="nav.signout_button"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="font-body text-sm gradient-gold-accent border-0 text-primary-foreground hover:opacity-90 transition-smooth shadow-gold-glow"
                  onClick={login}
                  data-ocid="nav.signin_button"
                >
                  Sign In
                </Button>
              )}

              {/* Admin Link */}
              <Link
                to="/admin"
                className="hidden md:flex"
                data-ocid="nav.admin_link"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/8 transition-smooth"
                  title="Admin Dashboard"
                >
                  <ChefHatIcon className="w-5 h-5 text-muted-foreground" />
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-white/8"
                onClick={() => setMobileOpen(!mobileOpen)}
                data-ocid="nav.mobile_menu_button"
              >
                {mobileOpen ? (
                  <XIcon className="w-5 h-5" />
                ) : (
                  <MenuIcon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden md:hidden border-t border-white/5"
            >
              <nav
                className="px-4 py-3 space-y-1 bg-card"
                data-ocid="nav.mobile_menu"
              >
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-smooth ${
                      isActive(to)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                    data-ocid={`nav.mobile_${label.toLowerCase().replace(/\s+/g, "_")}_link`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground hover:bg-white/5 transition-smooth"
                  data-ocid="nav.mobile_admin_link"
                >
                  <ChefHatIcon className="w-4 h-4" />
                  Admin
                </Link>
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body text-primary hover:bg-primary/10 transition-smooth"
                    data-ocid="nav.mobile_signin_button"
                  >
                    <UserIcon className="w-4 h-4" />
                    Sign In with Internet Identity
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background" data-ocid="main.content">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="bg-card border-t border-white/5 mt-auto"
        data-ocid="footer.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <ChefHatIcon className="w-6 h-6 text-primary" />
                <span className="font-display italic text-2xl text-gradient-gold">
                  youCallIT
                </span>
              </div>
              <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-xs">
                Fine dining reimagined — where every dish is crafted to your
                exact vision. You call it, we create it.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                <MessageCircleIcon className="w-4 h-4 text-primary" />
                <span>Direct chef communication available</span>
              </div>
            </div>

            {/* Hours */}
            <div className="space-y-3">
              <h3 className="text-sm font-body font-semibold tracking-widest uppercase text-muted-foreground">
                Hours
              </h3>
              <div className="space-y-1.5 text-sm font-body">
                <div className="flex justify-between gap-4 text-foreground/80">
                  <span>Mon–Thu</span>
                  <span>5pm – 11pm</span>
                </div>
                <div className="flex justify-between gap-4 text-foreground/80">
                  <span>Fri–Sat</span>
                  <span>5pm – 1am</span>
                </div>
                <div className="flex justify-between gap-4 text-foreground/80">
                  <span>Sunday</span>
                  <span>4pm – 10pm</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h3 className="text-sm font-body font-semibold tracking-widest uppercase text-muted-foreground">
                Contact
              </h3>
              <div className="space-y-1.5 text-sm font-body text-foreground/80">
                <p>+1 (555) 867-5309</p>
                <p>hello@youcallit.dining</p>
                <p className="text-muted-foreground">
                  12 Culinary Lane, NY 10001
                </p>
              </div>
            </div>
          </div>

          <div className="section-divider my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-body">
            <p>© {new Date().getFullYear()} youCallIT. All rights reserved.</p>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-smooth"
            >
              Built with love using caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
