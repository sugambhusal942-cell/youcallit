import Types "../types/reservations";
import ReservationsLib "../lib/reservations";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  tables : List.List<Types.Table>,
  reservations : List.List<Types.Reservation>,
  nextReservationIds : [var Nat],
) {
  // nextReservationIds[0] = nextReservationId

  public query func getAvailableTables(date : Text, time : Text, guestCount : Nat) : async [Types.Table] {
    ReservationsLib.getAvailableTables(tables, reservations, date, time, guestCount);
  };

  public shared ({ caller }) func makeReservation(
    tableId : Nat,
    guestCount : Nat,
    date : Text,
    time : Text,
    customerName : Text,
    phone : Text,
    email : Text,
    specialOccasion : ?Text,
    notes : ?Text,
  ) : async Types.Reservation {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    let r = ReservationsLib.makeReservation(reservations, nextReservationIds[0], caller, tableId, guestCount, date, time, customerName, phone, email, specialOccasion, notes);
    nextReservationIds[0] += 1;
    r;
  };

  public query func getReservation(id : Nat) : async ?Types.Reservation {
    ReservationsLib.getReservation(reservations, id);
  };

  public shared ({ caller }) func getCustomerReservations() : async [Types.Reservation] {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    ReservationsLib.getCustomerReservations(reservations, caller);
  };

  public shared ({ caller }) func cancelReservation(id : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    ReservationsLib.cancelReservation(reservations, id, caller);
  };

  public shared ({ caller }) func modifyReservation(updated : Types.Reservation) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    // Ensure the customer owns this reservation
    switch (ReservationsLib.getReservation(reservations, updated.id)) {
      case null Runtime.trap("Reservation not found");
      case (?existing) {
        if (not caller.isController() and not Principal.equal(existing.customerId, caller)) {
          Runtime.trap("Unauthorized");
        };
      };
    };
    ReservationsLib.modifyReservation(reservations, updated);
  };

  // Admin APIs
  public shared ({ caller }) func getAllReservations() : async [Types.Reservation] {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    ReservationsLib.getAllReservations(reservations);
  };

  public shared ({ caller }) func updateReservationStatus(id : Nat, status : Types.ReservationStatus) : async Bool {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    ReservationsLib.updateReservationStatus(reservations, id, status);
  };

  public shared ({ caller }) func updateTableStatus(id : Nat, status : Types.TableStatus) : async Bool {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    ReservationsLib.updateTableStatus(tables, id, status);
  };

  public query func getAllTables() : async [Types.Table] {
    ReservationsLib.getAllTables(tables);
  };
};
