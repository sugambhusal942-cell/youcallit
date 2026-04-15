import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  Clock,
  Loader2,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { OrderType } from "../backend";
import type { CartItem } from "../types";

interface FormData {
  orderType: OrderType;
  tableNumber: string;
  name: string;
  phone: string;
  email: string;
  specialInstructions: string;
}

interface FormErrors {
  tableNumber?: string;
  name?: string;
  phone?: string;
  email?: string;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (data.orderType === OrderType.dineIn && !data.tableNumber.trim()) {
    errors.tableNumber = "Table number is required for dine-in.";
  }
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\+?[\d\s\-().]{7,15}$/.test(data.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>({
    orderType: OrderType.dineIn,
    tableNumber: "",
    name: "",
    phone: "",
    email: "",
    specialInstructions: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  const estimatedWait =
    formData.orderType === OrderType.dineIn ? "20–30 min" : "15–20 min";

  function handleBlur(field: keyof FormData) {
    setTouched((t) => ({ ...t, [field]: true }));
    const newErrors = validate({ ...formData });
    setErrors(newErrors);
  }

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    if (touched[key]) {
      setErrors(validate(updated));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce<
      Partial<Record<keyof FormData, boolean>>
    >((acc, k) => {
      acc[k as keyof FormData] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    await onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
      data-ocid="checkout.form"
    >
      {/* Order type toggle */}
      <div>
        <Label className="text-muted-foreground text-xs uppercase tracking-widest mb-3 block">
          Order Type
        </Label>
        <div className="relative grid grid-cols-2 gap-0 bg-muted rounded-xl p-1">
          <motion.div
            className="absolute inset-y-1 rounded-lg bg-primary shadow-subtle pointer-events-none"
            style={{ width: "calc(50% - 4px)" }}
            animate={{
              x:
                formData.orderType === OrderType.dineIn
                  ? 4
                  : "calc(100% + 4px)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          {(
            [
              {
                type: OrderType.dineIn,
                label: "Dine In",
                icon: UtensilsCrossed,
              },
              { type: OrderType.takeout, label: "Takeout", icon: ShoppingBag },
            ] as const
          ).map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => set("orderType", type)}
              className={`relative z-10 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-smooth ${
                formData.orderType === type
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`checkout.order_type_${type}_toggle`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Estimated wait */}
      <motion.div
        layout
        className="flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-3 border border-border"
      >
        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-sm text-muted-foreground">
          Estimated wait time:
        </span>
        <span className="text-sm font-semibold text-foreground">
          {estimatedWait}
        </span>
      </motion.div>

      {/* Table number for dine-in */}
      <AnimatePresence>
        {formData.orderType === OrderType.dineIn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="tableNumber"
                className="text-sm text-muted-foreground"
              >
                Table Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tableNumber"
                placeholder="e.g. 12"
                value={formData.tableNumber}
                onChange={(e) => set("tableNumber", e.target.value)}
                onBlur={() => handleBlur("tableNumber")}
                className="bg-muted border-input focus:border-primary"
                data-ocid="checkout.table_number_input"
              />
              {touched.tableNumber && errors.tableNumber && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="checkout.table_number_error"
                >
                  {errors.tableNumber}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Alexandre Dubois"
          value={formData.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          className="bg-muted border-input focus:border-primary"
          data-ocid="checkout.name_input"
        />
        {touched.name && errors.name && (
          <p
            className="text-destructive text-xs mt-1"
            data-ocid="checkout.name_error"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm text-muted-foreground">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            className="bg-muted border-input focus:border-primary"
            data-ocid="checkout.phone_input"
          />
          {touched.phone && errors.phone && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid="checkout.phone_error"
            >
              {errors.phone}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm text-muted-foreground">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className="bg-muted border-input focus:border-primary"
            data-ocid="checkout.email_input"
          />
          {touched.email && errors.email && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid="checkout.email_error"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Special instructions */}
      <div className="space-y-1.5">
        <Label htmlFor="special" className="text-sm text-muted-foreground">
          Special Instructions{" "}
          <span className="text-muted-foreground/60 text-xs">(optional)</span>
        </Label>
        <Textarea
          id="special"
          placeholder="Allergies, dietary requirements, preferences..."
          value={formData.specialInstructions}
          onChange={(e) => set("specialInstructions", e.target.value)}
          rows={3}
          className="bg-muted border-input focus:border-primary resize-none"
          data-ocid="checkout.instructions_textarea"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-6 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-smooth flex items-center justify-center gap-2"
        data-ocid="checkout.place_order_button"
      >
        {isSubmitting ? (
          <>
            <Loader2
              className="w-5 h-5 animate-spin"
              data-ocid="checkout.loading_state"
            />
            Placing your order…
          </>
        ) : (
          <>
            Place Order
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  );
}

export type { FormData as CheckoutFormData };
