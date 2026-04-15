import Types "../types/orders";
import Common "../types/common";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func placeOrder(
    orders : List.List<Types.Order>,
    nextId : Nat,
    customerId : Common.UserId,
    items : [Types.OrderItem],
    orderType : Types.OrderType,
    specialInstructions : Text,
    tableNumber : ?Nat,
    subtotal : Nat,
    now : Common.Timestamp,
  ) : Types.Order {
    let tax = subtotal * 8 / 100;
    let order : Types.Order = {
      id = nextId;
      customerId;
      items;
      orderType;
      status = #pending;
      subtotal;
      tax;
      total = subtotal + tax;
      createdAt = now;
      specialInstructions;
      tableNumber;
    };
    orders.add(order);
    order;
  };

  public func getOrder(orders : List.List<Types.Order>, id : Nat) : ?Types.Order {
    orders.find(func(o) { o.id == id });
  };

  public func getCustomerOrders(orders : List.List<Types.Order>, customerId : Common.UserId) : [Types.Order] {
    orders.filter(func(o) { Principal.equal(o.customerId, customerId) }).toArray();
  };

  public func cancelOrder(orders : List.List<Types.Order>, id : Nat, caller : Common.UserId) : Bool {
    var found = false;
    orders.mapInPlace(func(o) {
      if (o.id == id and Principal.equal(o.customerId, caller) and o.status == #pending) {
        found := true;
        { o with status = #cancelled }
      } else { o }
    });
    found;
  };

  public func getAllOrders(orders : List.List<Types.Order>) : [Types.Order] {
    orders.toArray();
  };

  public func updateOrderStatus(orders : List.List<Types.Order>, id : Nat, status : Types.OrderStatus) : Bool {
    var found = false;
    orders.mapInPlace(func(o) {
      if (o.id == id) { found := true; { o with status } } else { o }
    });
    found;
  };

  public func getOrdersByStatus(orders : List.List<Types.Order>, status : Types.OrderStatus) : [Types.Order] {
    orders.filter(func(o) { o.status == status }).toArray();
  };
};
