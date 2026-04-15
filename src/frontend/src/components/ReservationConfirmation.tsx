import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ChefHatIcon,
  ClockIcon,
  MessageCircleIcon,
  TableIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { motion } from "motion/react";
import type { Reservation } from "../backend";

interface ReservationConfirmationProps {
  reservation: Reservation;
  onCancel: () => void;
  isCancelling: boolean;
}

const OCCASION_EMOJI: Record<string, string> = {
  Birthday: "🎂",
  Anniversary: "💍",
  "Business Dinner": "💼",
  Engagement: "💎",
  Graduation: "🎓",
};

export function ReservationConfirmation({
  reservation,
  onCancel,
  isCancelling,
}: ReservationConfirmationProps) {
  const occasion = reservation.specialOccasion;
  const occasionEmoji = occasion ? (OCCASION_EMOJI[occasion] ?? "✨") : null;

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex flex-col items-center gap-6"
      data-ocid="reservation_confirmation.section"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-gold-glow">
          <CheckCircle2Icon className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
          <span className="text-xs">✓</span>
        </div>
      </motion.div>

      <div className="text-center space-y-1">
        <h2 className="font-display text-3xl text-gradient-gold italic">
          Reservation Confirmed
        </h2>
        <p className="font-body text-muted-foreground text-sm">
          We look forward to welcoming you,{" "}
          {reservation.customerName.split(" ")[0]}
        </p>
      </div>

      {/* Confirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm rounded-xl border border-primary/20 bg-card overflow-hidden shadow-luxury"
        data-ocid="reservation_confirmation.card"
      >
        {/* Card Header */}
        <div className="gradient-gold-accent px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHatIcon className="w-4 h-4 text-primary-foreground/80" />
            <span className="font-body font-semibold text-primary-foreground text-sm tracking-wide">
              youCallIT Fine Dining
            </span>
          </div>
          <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 text-xs font-body">
            #{reservation.id.toString().padStart(4, "0")}
          </Badge>
        </div>

        {/* Card Body */}
        <div className="px-5 py-5 space-y-3">
          <DetailRow
            icon={<CalendarIcon className="w-4 h-4 text-primary" />}
            label="Date"
            value={formatDate(reservation.date)}
          />
          <DetailRow
            icon={<ClockIcon className="w-4 h-4 text-primary" />}
            label="Time"
            value={formatTime(reservation.time)}
          />
          <DetailRow
            icon={<TableIcon className="w-4 h-4 text-primary" />}
            label="Table"
            value={`Table #${reservation.tableId.toString()}`}
          />
          <DetailRow
            icon={<UsersIcon className="w-4 h-4 text-primary" />}
            label="Guests"
            value={`${reservation.guestCount.toString()} guests`}
          />

          {occasionEmoji && occasion && (
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">{occasionEmoji}</span>
                <span className="font-body text-foreground/80">{occasion}</span>
              </div>
            </div>
          )}

          {reservation.notes && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground font-body italic">
                "{reservation.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-5 py-3 bg-muted/30 border-t border-border/20">
          <p className="text-xs text-muted-foreground font-body">
            Confirmation sent to{" "}
            <span className="text-foreground/70">{reservation.email}</span>
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Link to="/chat/$orderId" params={{ orderId: "0" }} className="flex-1">
          <Button
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 font-body transition-smooth gap-2"
            data-ocid="reservation_confirmation.chat_button"
          >
            <MessageCircleIcon className="w-4 h-4" />
            Chat with Chef
          </Button>
        </Link>

        <Button
          variant="outline"
          className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60 font-body transition-smooth gap-2"
          onClick={onCancel}
          disabled={isCancelling}
          data-ocid="reservation_confirmation.cancel_button"
        >
          {isCancelling ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-destructive/30 border-t-destructive animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <XCircleIcon className="w-4 h-4" />
              Cancel
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex items-center justify-between flex-1 min-w-0">
        <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm font-body font-medium text-foreground truncate ml-2">
          {value}
        </span>
      </div>
    </div>
  );
}
