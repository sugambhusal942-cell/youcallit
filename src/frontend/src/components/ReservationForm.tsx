import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { useState } from "react";

export interface GuestInfo {
  name: string;
  phone: string;
  email: string;
  specialOccasion: string;
  notes: string;
}

interface ReservationFormProps {
  guestInfo: GuestInfo;
  onUpdate: (info: GuestInfo) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const OCCASIONS = [
  { value: "", label: "Just Dinner — No Special Occasion" },
  { value: "Birthday", label: "🎂 Birthday Celebration" },
  { value: "Anniversary", label: "💍 Anniversary" },
  { value: "Business Dinner", label: "💼 Business Dinner" },
  { value: "Engagement", label: "💎 Engagement" },
  { value: "Graduation", label: "🎓 Graduation" },
];

export function ReservationForm({
  guestInfo,
  onUpdate,
  onSubmit,
  isSubmitting,
}: ReservationFormProps) {
  const [touched, setTouched] = useState<
    Partial<Record<keyof GuestInfo, boolean>>
  >({});

  const set = (field: keyof GuestInfo, value: string) =>
    onUpdate({ ...guestInfo, [field]: value });

  const blur = (field: keyof GuestInfo) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const isValid =
    guestInfo.name.trim().length >= 2 &&
    guestInfo.phone.trim().length >= 7 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email);

  const fieldClass = (field: keyof GuestInfo, validate: boolean) =>
    `bg-card border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/70 focus:ring-primary/20 transition-smooth font-body${
      touched[field] && validate ? " border-destructive/60" : ""
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="space-y-6"
      data-ocid="reservation_form.section"
    >
      <div className="text-center mb-6">
        <h3 className="font-display text-2xl text-foreground italic mb-1">
          Your Details
        </h3>
        <p className="text-muted-foreground font-body text-sm">
          We'll confirm your reservation by email
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-xs tracking-widest uppercase text-muted-foreground font-body">
            Full Name *
          </Label>
          <Input
            value={guestInfo.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
            placeholder="Your full name"
            className={fieldClass("name", guestInfo.name.trim().length < 2)}
            data-ocid="reservation_form.name_input"
          />
          {touched.name && guestInfo.name.trim().length < 2 && (
            <p
              className="text-xs text-destructive font-body"
              data-ocid="reservation_form.name_error"
            >
              Please enter your full name
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label className="text-xs tracking-widest uppercase text-muted-foreground font-body">
            Phone *
          </Label>
          <Input
            type="tel"
            value={guestInfo.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => blur("phone")}
            placeholder="+1 (555) 000-0000"
            className={fieldClass("phone", guestInfo.phone.trim().length < 7)}
            data-ocid="reservation_form.phone_input"
          />
          {touched.phone && guestInfo.phone.trim().length < 7 && (
            <p
              className="text-xs text-destructive font-body"
              data-ocid="reservation_form.phone_error"
            >
              Please enter a valid phone number
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-xs tracking-widest uppercase text-muted-foreground font-body">
            Email *
          </Label>
          <Input
            type="email"
            value={guestInfo.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
            placeholder="you@example.com"
            className={fieldClass(
              "email",
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email),
            )}
            data-ocid="reservation_form.email_input"
          />
          {touched.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email) && (
              <p
                className="text-xs text-destructive font-body"
                data-ocid="reservation_form.email_error"
              >
                Please enter a valid email
              </p>
            )}
        </div>

        {/* Special Occasion */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-xs tracking-widest uppercase text-muted-foreground font-body">
            Special Occasion
          </Label>
          <select
            value={guestInfo.specialOccasion}
            onChange={(e) => set("specialOccasion", e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-card border border-border/50 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/70 transition-smooth"
            data-ocid="reservation_form.occasion_select"
          >
            {OCCASIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-card">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="text-xs tracking-widest uppercase text-muted-foreground font-body">
            Special Requests & Seating Preferences
          </Label>
          <Textarea
            value={guestInfo.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Window seat preference, dietary requirements, accessibility needs..."
            className="bg-card border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/70 font-body resize-none"
            rows={3}
            data-ocid="reservation_form.notes_textarea"
          />
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
        className="w-full gradient-gold-accent text-primary-foreground font-body font-semibold tracking-wide shadow-gold-glow hover:opacity-90 transition-smooth h-12"
        data-ocid="reservation_form.submit_button"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            Confirming Reservation...
          </span>
        ) : (
          "Confirm Reservation"
        )}
      </Button>
    </motion.div>
  );
}
