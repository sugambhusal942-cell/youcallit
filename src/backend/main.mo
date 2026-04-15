import MenuTypes "types/menu";
import OrderTypes "types/orders";
import ReservationTypes "types/reservations";
import ChatTypes "types/chat";
import ProfileTypes "types/profile";
import CommonTypes "types/common";
import List "mo:core/List";
import Map "mo:core/Map";

import MenuLib "lib/menu";
import ReservationsLib "lib/reservations";

import MenuApi "mixins/menu-api";
import OrdersApi "mixins/orders-api";
import ReservationsApi "mixins/reservations-api";
import ChatApi "mixins/chat-api";
import ProfileApi "mixins/profile-api";

actor {
  // Menu state — seeded once on first deploy (persists via enhanced orthogonal persistence)
  let menuCategories : List.List<MenuTypes.MenuCategory> = do {
    let c = List.empty<MenuTypes.MenuCategory>();
    MenuLib.seedCategories(c);
    c;
  };
  let menuItems : List.List<MenuTypes.MenuItem> = do {
    let i = List.empty<MenuTypes.MenuItem>();
    MenuLib.seedItems(i);
    i;
  };
  // [0] = nextMenuCategoryId (5 seeded, next = 6), [1] = nextMenuItemId (26 seeded, next = 27)
  let nextMenuIds : [var Nat] = [var 6, 27];

  // Orders state
  let orders = List.empty<OrderTypes.Order>();
  let nextOrderIds : [var Nat] = [var 1]; // [0] = nextOrderId

  // Reservations state — 15 tables seeded
  let tables : List.List<ReservationTypes.Table> = do {
    let t = List.empty<ReservationTypes.Table>();
    ReservationsLib.seedTables(t);
    t;
  };
  let reservations = List.empty<ReservationTypes.Reservation>();
  let nextReservationIds : [var Nat] = [var 1]; // [0] = nextReservationId

  // Chat state
  let chatThreads = Map.empty<Nat, ChatTypes.ChatThread>();
  let nextChatIds : [var Nat] = [var 1, 1]; // [0] = nextChatMsgId, [1] = nextChatThreadId

  // Profile state
  let profiles = Map.empty<CommonTypes.UserId, ProfileTypes.CustomerProfile>();

  // Include all domain mixins
  include MenuApi(menuCategories, menuItems, nextMenuIds);
  include OrdersApi(orders, nextOrderIds, menuItems);
  include ReservationsApi(tables, reservations, nextReservationIds);
  include ChatApi(chatThreads, nextChatIds);
  include ProfileApi(profiles);
};
