import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ReservationStatus } from "../../backend";
import type { Reservation } from "../../backend";
import {
  useAllReservations,
  useUpdateReservationStatus,
} from "../../hooks/useQueries";
import { StatusBadge } from "../ui/StatusBadge";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function ReservationRow({
  res,
  index,
}: {
  res: Reservation;
  index: number;
}) {
  const { mutate: updateStatus, isPending } = useUpdateReservationStatus();

  function confirm() {
    updateStatus(
      { id: res.id, status: ReservationStatus.confirmed },
      {
        onSuccess: () => toast.success("Reservation confirmed"),
        onError: () => toast.error("Failed"),
      },
    );
  }

  function cancel() {
    updateStatus(
      { id: res.id, status: ReservationStatus.cancelled },
      {
        onSuccess: () => toast.success("Reservation cancelled"),
        onError: () => toast.error("Failed"),
      },
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-xl hover:border-primary/20 transition-smooth"
      data-ocid={`reservations.item.${index + 1}`}
    >
      {/* Time + Date */}
      <div className="w-20 flex-shrink-0 text-center">
        <p className="text-sm font-semibold text-foreground">{res.time}</p>
        <p className="text-xs text-muted-foreground">{res.date}</p>
      </div>

      <div
        className="w-px self-stretch bg-border flex-shrink-0"
        aria-hidden="true"
      />

      {/* Guest info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground text-sm truncate">
            {res.customerName}
          </span>
          {res.specialOccasion && (
            <span className="flex items-center gap-1 text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/25">
              <Star className="w-3 h-3" /> {res.specialOccasion}
            </span>
          )}
          <StatusBadge status={res.status} />
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {String(res.guestCount)} guests
          </span>
          <span>Table #{String(res.tableId)}</span>
          {res.phone && <span>{res.phone}</span>}
        </div>
        {res.notes && (
          <p className="text-xs text-muted-foreground italic mt-1 truncate">
            "{res.notes}"
          </p>
        )}
      </div>

      {/* Actions */}
      {res.status === ReservationStatus.pending && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={confirm}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/30 text-emerald-400 border border-emerald-700/30 text-xs font-medium hover:bg-emerald-900/50 transition-smooth disabled:opacity-50"
            data-ocid={`reservations.confirm_button.${index + 1}`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Confirm
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/30 text-red-400 border border-red-700/30 text-xs font-medium hover:bg-red-900/50 transition-smooth disabled:opacity-50"
            data-ocid={`reservations.cancel_button.${index + 1}`}
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function ReservationsPanel() {
  const { data: reservations = [], isLoading } = useAllReservations();
  const [dateFilter, setDateFilter] = useState<"today" | "all">("today");

  const filtered =
    dateFilter === "today"
      ? reservations.filter((r) => r.date === today())
      : reservations;

  const sorted = [...filtered].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  const pending = sorted.filter((r) => r.status === ReservationStatus.pending);
  const confirmed = sorted.filter(
    (r) => r.status === ReservationStatus.confirmed,
  );
  const others = sorted.filter(
    (r) =>
      r.status !== ReservationStatus.pending &&
      r.status !== ReservationStatus.confirmed,
  );

  return (
    <div className="p-6 h-full overflow-auto" data-ocid="reservations.panel">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display italic text-2xl text-foreground">
            Reservations
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {sorted.length} reservation{sorted.length !== 1 ? "s" : ""}{" "}
            {dateFilter === "today" ? "today" : "total"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex rounded-xl overflow-hidden border border-border">
            {(["today", "all"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setDateFilter(f)}
                className={`px-4 py-2 text-sm transition-smooth ${
                  dateFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`reservations.filter.${f}`}
              >
                {f === "today" ? "Today" : "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center h-64 text-center"
          data-ocid="reservations.empty_state"
        >
          <Calendar className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-foreground font-medium">
            No reservations {dateFilter === "today" ? "today" : ""}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Reservations will appear here when guests book
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-yellow-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
                  Awaiting Confirmation ({pending.length})
                </h2>
              </div>
              <div className="space-y-2">
                {pending.map((r, i) => (
                  <ReservationRow key={String(r.id)} res={r} index={i} />
                ))}
              </div>
            </section>
          )}

          {confirmed.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  Confirmed ({confirmed.length})
                </h2>
              </div>
              <div className="space-y-2">
                {confirmed.map((r, i) => (
                  <ReservationRow
                    key={String(r.id)}
                    res={r}
                    index={pending.length + i}
                  />
                ))}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Past / Cancelled ({others.length})
                </h2>
              </div>
              <div className="space-y-2">
                {others.map((r, i) => (
                  <ReservationRow
                    key={String(r.id)}
                    res={r}
                    index={pending.length + confirmed.length + i}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
