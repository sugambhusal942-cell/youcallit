import Types "../types/orders";
import MenuTypes "../types/menu";
import OrdersLib "../lib/orders";
import MenuLib "../lib/menu";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

mixin (
  orders : List.List<Types.Order>,
  nextOrderIds : [var Nat],
  menuItems : List.List<MenuTypes.MenuItem>,
) {
  // nextOrderIds[0] = nextOrderId

  func computeSubtotal(items : [Types.OrderItem]) : Nat {
    var total : Nat = 0;
    for (item in items.vals()) {
      switch (MenuLib.getItem(menuItems, item.menuItemId)) {
        case (?menuItem) { total += menuItem.price * item.quantity };
        case null {};
      };
    };
    total;
  };

  public shared ({ caller }) func placeOrder(
    items : [Types.OrderItem],
    orderType : Types.OrderType,
    specialInstructions : Text,
    tableNumber : ?Nat,
  ) : async Types.Order {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    let subtotal = computeSubtotal(items);
    let order = OrdersLib.placeOrder(orders, nextOrderIds[0], caller, items, orderType, specialInstructions, tableNumber, subtotal, Time.now());
    nextOrderIds[0] += 1;
    order;
  };

  public query func getOrder(id : Nat) : async ?Types.Order {
    OrdersLib.getOrder(orders, id);
  };

  public shared ({ caller }) func getCustomerOrders() : async [Types.Order] {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    OrdersLib.getCustomerOrders(orders, caller);
  };

  public shared ({ caller }) func cancelOrder(id : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    OrdersLib.cancelOrder(orders, id, caller);
  };

  // Admin APIs
  public shared ({ caller }) func getAllOrders() : async [Types.Order] {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    OrdersLib.getAllOrders(orders);
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : Types.OrderStatus) : async Bool {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    OrdersLib.updateOrderStatus(orders, id, status);
  };

  public shared ({ caller }) func getOrdersByStatus(status : Types.OrderStatus) : async [Types.Order] {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    OrdersLib.getOrdersByStatus(orders, status);
  };
};
