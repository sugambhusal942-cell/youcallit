import Common "common";

module {
  public type TableStatus = {
    #available;
    #reserved;
    #occupied;
    #maintenance;
  };

  public type Table = {
    id : Nat;
    number : Nat;
    capacity : Nat;
    x : Nat;
    y : Nat;
    status : TableStatus;
  };

  public type ReservationStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  public type Reservation = {
    id : Nat;
    customerId : Common.UserId;
    tableId : Nat;
    guestCount : Nat;
    date : Text; // YYYY-MM-DD
    time : Text; // HH:MM
    customerName : Text;
    phone : Text;
    email : Text;
    specialOccasion : ?Text;
    notes : ?Text;
    status : ReservationStatus;
  };
};
