import Common "common";

module {
  public type OrderItem = {
    menuItemId : Nat;
    quantity : Nat;
    specialInstructions : Text;
  };

  public type OrderType = {
    #dineIn;
    #takeout;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #preparing;
    #ready;
    #completed;
    #cancelled;
  };

  public type Order = {
    id : Nat;
    customerId : Common.UserId;
    items : [OrderItem];
    orderType : OrderType;
    status : OrderStatus;
    subtotal : Nat;
    tax : Nat;
    total : Nat;
    createdAt : Common.Timestamp;
    specialInstructions : Text;
    tableNumber : ?Nat;
  };
};
