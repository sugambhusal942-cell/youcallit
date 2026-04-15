import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  TableIcon,
  UsersIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Reservation, Table } from "../backend";
import { TableStatus } from "../backend";
import { FloorPlan } from "../components/FloorPlan";
import { ReservationConfirmation } from "../components/ReservationConfirmation";
import { ReservationForm } from "../components/ReservationForm";
import type { GuestInfo } from "../components/ReservationForm";
import {
  useAvailableTables,
  useCancelReservation,
  useCustomerReservations,
  useMakeReservation,
} from "../hooks/useQueries";

// ── Time Slots ────────────────────────────────────────────────────────────────
const TIME_SLOTS: string[] = [];
for (let h = 11; h <= 22; h++) {
  TIME_SLOTS.push(`${h.toString().padStart(2, "0")}:00`);
  if (h < 22) TIME_SLOTS.push(`${h.toString().padStart(2, "0")}:30`);
}

function formatSlot(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}

// ── Step Progress ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Date & Time", icon: CalendarIcon },
  { id: 2, label: "Choose Table", icon: TableIcon },
  { id: 3, label: "Your Details", icon: UsersIcon },
  { id: 4, label: "Confirmed", icon: CheckIcon },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div
      className="flex items-center justify-center gap-2 mb-10"
      data-ocid="reservations.step_indicator"
    >
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const done = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  background:
                    done || active
                      ? "oklch(0.68 0.18 65)"
                      : "oklch(0.2 0.022 50)",
                  borderColor:
                    done || active
                      ? "oklch(0.68 0.18 65)"
                      : "oklch(0.28 0.02 50)",
                  scale: active ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-sm"
              >
                {done ? (
                  <CheckIcon className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${active ? "text-primary-foreground" : "text-muted-foreground"}`}
                  />
                )}
              </motion.div>
              <span
                className={`text-xs font-body hidden sm:block ${active ? "text-primary" : done ? "text-foreground/60" : "text-muted-foreground"}`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <motion.div
                animate={{
                  background: done
                    ? "oklch(0.68 0.18 65 / 0.6)"
                    : "oklch(0.28 0.02 50)",
                }}
                transition={{ duration: 0.3 }}
                className="w-12 sm:w-16 h-0.5 mx-1 mt-[-14px]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const DEMO_TABLES: Table[] = Array.from({ length: 10 }, (_, i) => ({
  id: BigInt(i + 1),
  number: BigInt(i + 1),
  capacity: BigInt([2, 2, 4, 4, 4, 6, 2, 2, 4, 8][i]),
  x: BigInt(0),
  y: BigInt(0),
  status: [
    TableStatus.available,
    TableStatus.available,
    TableStatus.reserved,
    TableStatus.available,
    TableStatus.occupied,
    TableStatus.available,
    TableStatus.available,
    TableStatus.reserved,
    TableStatus.available,
    TableStatus.available,
  ][i],
}));

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReservationsPage() {
  const [step, setStep] = useState(1);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: "",
    phone: "",
    email: "",
    specialOccasion: "",
    notes: "",
  });
  const [confirmedReservation, setConfirmedReservation] =
    useState<Reservation | null>(null);

  const { data: availableTables = [], isLoading: tablesLoading } =
    useAvailableTables(date, time, BigInt(guestCount));
  const makeReservation = useMakeReservation();
  const cancelReservation = useCancelReservation();

  const floorTables = useMemo(
    () =>
      step === 2 && availableTables.length > 0 ? availableTables : DEMO_TABLES,
    [step, availableTables],
  );

  const handleStep1Next = () => {
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!selectedTable) {
      toast.error("Please select a table from the floor plan");
      return;
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedTable) return;
    try {
      const result = await makeReservation.mutateAsync({
        tableId: selectedTable.id,
        guestCount: BigInt(guestCount),
        date,
        time,
        customerName: guestInfo.name,
        phone: guestInfo.phone,
        email: guestInfo.email,
        specialOccasion: guestInfo.specialOccasion || null,
        notes: guestInfo.notes || null,
      });
      setConfirmedReservation(result);
      setStep(4);
      toast.success("Reservation confirmed! 🎉");
    } catch {
      toast.error("Unable to complete reservation. Please try again.");
    }
  };

  const handleCancel = async () => {
    if (!confirmedReservation) return;
    try {
      await cancelReservation.mutateAsync(confirmedReservation.id);
      toast.success("Reservation cancelled");
      setStep(1);
      setConfirmedReservation(null);
      setSelectedTable(null);
      setGuestInfo({
        name: "",
        phone: "",
        email: "",
        specialOccasion: "",
        notes: "",
      });
    } catch {
      toast.error("Unable to cancel reservation");
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display italic text-4xl sm:text-5xl text-gradient-gold mb-2"
        >
          Reserve Your Table
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="font-body text-muted-foreground"
        >
          Secure your seat at the finest table in the city
        </motion.p>
      </div>

      <div className="max-w-3xl mx-auto">
        <StepIndicator current={step} />

        <div className="bg-card rounded-2xl border border-border/30 shadow-luxury overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1 — Date / Time / Guests */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 sm:p-10 space-y-8"
                data-ocid="reservations.step1_panel"
              >
                <div>
                  <h3 className="font-display italic text-2xl text-foreground mb-1">
                    When Are You Visiting?
                  </h3>
                  <p className="font-body text-muted-foreground text-sm">
                    Select your preferred date, time, and party size
                  </p>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label
                    htmlFor="res-date"
                    className="text-xs font-body tracking-widest uppercase text-muted-foreground"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70 pointer-events-none" />
                    <input
                      id="res-date"
                      type="date"
                      value={date}
                      min={today}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setSelectedTable(null);
                      }}
                      className="w-full h-11 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/70 transition-smooth [color-scheme:dark]"
                      data-ocid="reservations.date_input"
                    />
                  </div>
                </div>

                {/* Guest Count */}
                <div className="space-y-2">
                  <p className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                    Party Size
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 rounded-full border-border/50 hover:border-primary/50 hover:text-primary transition-smooth"
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      disabled={guestCount <= 1}
                      data-ocid="reservations.guest_decrement_button"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </Button>
                    <motion.span
                      key={guestCount}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-display italic text-3xl text-foreground min-w-[3rem] text-center"
                    >
                      {guestCount}
                    </motion.span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 rounded-full border-border/50 hover:border-primary/50 hover:text-primary transition-smooth"
                      onClick={() => setGuestCount((c) => Math.min(12, c + 1))}
                      disabled={guestCount >= 12}
                      data-ocid="reservations.guest_increment_button"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                    <span className="font-body text-muted-foreground text-sm">
                      {guestCount === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-3">
                  <p className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                    Time
                  </p>
                  <div
                    className="grid grid-cols-4 sm:grid-cols-6 gap-2"
                    data-ocid="reservations.time_slots"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <motion.button
                        key={slot}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setTime(slot);
                          setSelectedTable(null);
                        }}
                        className={`py-2 px-1 rounded-lg text-xs font-body font-medium transition-smooth border ${
                          time === slot
                            ? "bg-primary/15 border-primary/60 text-primary shadow-gold-glow"
                            : "bg-muted/20 border-border/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                        data-ocid={`reservations.time_slot.${slot.replace(":", "")}`}
                      >
                        {formatSlot(slot)}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleStep1Next}
                  disabled={!date || !time}
                  className="w-full gradient-gold-accent text-primary-foreground font-body font-semibold h-12 gap-2 shadow-gold-glow hover:opacity-90 transition-smooth"
                  data-ocid="reservations.step1_next_button"
                >
                  Choose Your Table
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 2 — Floor Plan */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 sm:p-10 space-y-6"
                data-ocid="reservations.step2_panel"
              >
                <div>
                  <h3 className="font-display italic text-2xl text-foreground mb-1">
                    Choose Your Table
                  </h3>
                  <p className="font-body text-muted-foreground text-sm">
                    {date} at {formatSlot(time)} — {guestCount}{" "}
                    {guestCount === 1 ? "guest" : "guests"}
                  </p>
                </div>

                {tablesLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="w-full h-80 rounded-xl" />
                    <div className="flex gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-5 w-20 rounded" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <FloorPlan
                    tables={floorTables}
                    selectedTableId={selectedTable?.id ?? null}
                    onSelectTable={setSelectedTable}
                  />
                )}

                {selectedTable && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/30"
                    data-ocid="reservations.selected_table_info"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <TableIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-body font-semibold text-foreground">
                        Table #{Number(selectedTable.number)} selected
                      </p>
                      <p className="text-xs text-muted-foreground font-body">
                        Seats up to {Number(selectedTable.capacity)} guests
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-border/40 font-body transition-smooth gap-2"
                    onClick={() => setStep(1)}
                    data-ocid="reservations.step2_back_button"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleStep2Next}
                    disabled={!selectedTable}
                    className="flex-1 gradient-gold-accent text-primary-foreground font-body font-semibold gap-2 shadow-gold-glow hover:opacity-90 transition-smooth"
                    data-ocid="reservations.step2_next_button"
                  >
                    Your Details
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Guest Info */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 sm:p-10"
                data-ocid="reservations.step3_panel"
              >
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-smooth"
                  data-ocid="reservations.step3_back_button"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  Back to floor plan
                </button>
                <ReservationForm
                  guestInfo={guestInfo}
                  onUpdate={setGuestInfo}
                  onSubmit={handleSubmit}
                  isSubmitting={makeReservation.isPending}
                />
              </motion.div>
            )}

            {/* Step 4 — Confirmation */}
            {step === 4 && confirmedReservation && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 sm:p-10"
                data-ocid="reservations.step4_panel"
              >
                <ReservationConfirmation
                  reservation={confirmedReservation}
                  onCancel={handleCancel}
                  isCancelling={cancelReservation.isPending}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step === 1 && <PastReservationsSection />}
      </div>
    </div>
  );
}

// ── Past Reservations ─────────────────────────────────────────────────────────
function PastReservationsSection() {
  const { data: reservations = [], isLoading } = useCustomerReservations();

  if (isLoading) {
    return (
      <div className="mt-8 space-y-3">
        <Skeleton className="w-40 h-5 rounded" />
        <Skeleton className="w-full h-20 rounded-xl" />
      </div>
    );
  }

  if (reservations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8"
      data-ocid="reservations.past_section"
    >
      <h3 className="font-body text-sm uppercase tracking-widest text-muted-foreground mb-4">
        Your Recent Reservations
      </h3>
      <div className="space-y-3">
        {reservations.slice(0, 3).map((res, i) => (
          <div
            key={res.id.toString()}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border/20"
            data-ocid={`reservations.past_item.${i + 1}`}
          >
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-4 h-4 text-primary/70" />
              <div>
                <p className="text-sm font-body text-foreground">
                  {res.date} at {res.time}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Table #{res.tableId.toString()} · {Number(res.guestCount)}{" "}
                  guests
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-body px-2 py-1 rounded-full border ${
                res.status === "confirmed"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : res.status === "cancelled"
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-muted/30 border-border/20 text-muted-foreground"
              }`}
            >
              {String(res.status).charAt(0).toUpperCase() +
                String(res.status).slice(1)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
