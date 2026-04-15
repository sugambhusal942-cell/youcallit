import Types "../types/reservations";
import Common "../types/common";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  // Seed 15 tables with varied capacity and layout positions
  public func seedTables(tables : List.List<Types.Table>) {
    // Row 1 - window tables (2-person)
    tables.add({ id = 1; number = 1; capacity = 2; x = 5; y = 5; status = #available });
    tables.add({ id = 2; number = 2; capacity = 2; x = 5; y = 15; status = #available });
    tables.add({ id = 3; number = 3; capacity = 2; x = 5; y = 25; status = #available });
    // Row 2 - central (4-person)
    tables.add({ id = 4; number = 4; capacity = 4; x = 25; y = 5; status = #available });
    tables.add({ id = 5; number = 5; capacity = 4; x = 25; y = 17; status = #available });
    tables.add({ id = 6; number = 6; capacity = 4; x = 25; y = 29; status = #available });
    tables.add({ id = 7; number = 7; capacity = 4; x = 40; y = 5; status = #available });
    tables.add({ id = 8; number = 8; capacity = 4; x = 40; y = 17; status = #available });
    tables.add({ id = 9; number = 9; capacity = 4; x = 40; y = 29; status = #available });
    // Row 3 - private (6-person)
    tables.add({ id = 10; number = 10; capacity = 6; x = 60; y = 5; status = #available });
    tables.add({ id = 11; number = 11; capacity = 6; x = 60; y = 20; status = #available });
    tables.add({ id = 12; number = 12; capacity = 6; x = 60; y = 35; status = #available });
    // Private dining (8-person)
    tables.add({ id = 13; number = 13; capacity = 8; x = 80; y = 5; status = #available });
    tables.add({ id = 14; number = 14; capacity = 8; x = 80; y = 22; status = #available });
    // Chef's table (8-person)
    tables.add({ id = 15; number = 15; capacity = 8; x = 80; y = 39; status = #available });
  };

  func isConflicting(reservations : List.List<Types.Reservation>, tableId : Nat, date : Text, time : Text) : Bool {
    switch (reservations.find(func(r) {
      r.tableId == tableId and r.date == date and r.time == time and r.status != #cancelled
    })) {
      case (?_) true;
      case null false;
    }
  };

  public func getAvailableTables(
    tables : List.List<Types.Table>,
    reservations : List.List<Types.Reservation>,
    date : Text,
    time : Text,
    guestCount : Nat,
  ) : [Types.Table] {
    tables.filter(func(t) {
      t.status == #available and
      t.capacity >= guestCount and
      not isConflicting(reservations, t.id, date, time)
    }).toArray();
  };

  public func makeReservation(
    reservations : List.List<Types.Reservation>,
    nextId : Nat,
    customerId : Common.UserId,
    tableId : Nat,
    guestCount : Nat,
    date : Text,
    time : Text,
    customerName : Text,
    phone : Text,
    email : Text,
    specialOccasion : ?Text,
    notes : ?Text,
  ) : Types.Reservation {
    let r : Types.Reservation = {
      id = nextId;
      customerId;
      tableId;
      guestCount;
      date;
      time;
      customerName;
      phone;
      email;
      specialOccasion;
      notes;
      status = #pending;
    };
    reservations.add(r);
    r;
  };

  public func getReservation(reservations : List.List<Types.Reservation>, id : Nat) : ?Types.Reservation {
    reservations.find(func(r) { r.id == id });
  };

  public func getCustomerReservations(reservations : List.List<Types.Reservation>, customerId : Common.UserId) : [Types.Reservation] {
    reservations.filter(func(r) { Principal.equal(r.customerId, customerId) }).toArray();
  };

  public func cancelReservation(reservations : List.List<Types.Reservation>, id : Nat, caller : Common.UserId) : Bool {
    var found = false;
    reservations.mapInPlace(func(r) {
      if (r.id == id and Principal.equal(r.customerId, caller) and (r.status == #pending or r.status == #confirmed)) {
        found := true;
        { r with status = #cancelled }
      } else { r }
    });
    found;
  };

  public func modifyReservation(reservations : List.List<Types.Reservation>, updated : Types.Reservation) : Bool {
    var found = false;
    reservations.mapInPlace(func(r) {
      if (r.id == updated.id and (r.status == #pending or r.status == #confirmed)) {
        found := true;
        updated
      } else { r }
    });
    found;
  };

  public func getAllReservations(reservations : List.List<Types.Reservation>) : [Types.Reservation] {
    reservations.toArray();
  };

  public func updateReservationStatus(reservations : List.List<Types.Reservation>, id : Nat, status : Types.ReservationStatus) : Bool {
    var found = false;
    reservations.mapInPlace(func(r) {
      if (r.id == id) { found := true; { r with status } } else { r }
    });
    found;
  };

  public func updateTableStatus(tables : List.List<Types.Table>, id : Nat, status : Types.TableStatus) : Bool {
    var found = false;
    tables.mapInPlace(func(t) {
      if (t.id == id) { found := true; { t with status } } else { t }
    });
    found;
  };

  public func getAllTables(tables : List.List<Types.Table>) : [Types.Table] {
    tables.toArray();
  };
};
