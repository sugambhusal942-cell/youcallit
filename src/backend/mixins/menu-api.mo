import Types "../types/menu";
import Common "../types/common";
import MenuLib "../lib/menu";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  menuCategories : List.List<Types.MenuCategory>,
  menuItems : List.List<Types.MenuItem>,
  nextMenuIds : [var Nat],
) {
  // nextMenuIds[0] = nextMenuCategoryId, nextMenuIds[1] = nextMenuItemId

  func isMenuAdmin(caller : Principal) : Bool {
    caller.isController()
  };

  public query func getMenuCategories() : async [Types.MenuCategory] {
    MenuLib.getCategories(menuCategories);
  };

  public query func getMenuItems() : async [Types.MenuItem] {
    MenuLib.getItems(menuItems);
  };

  public query func getMenuItemsByCategory(categoryId : Nat) : async [Types.MenuItem] {
    MenuLib.getItemsByCategory(menuItems, categoryId);
  };

  public query func searchMenuItems(searchTerm : Text) : async [Types.MenuItem] {
    MenuLib.searchItems(menuItems, searchTerm);
  };

  public query func getMenuItem(id : Nat) : async ?Types.MenuItem {
    MenuLib.getItem(menuItems, id);
  };

  // Admin APIs
  public shared ({ caller }) func addMenuCategory(name : Text, description : Text, emoji : Text) : async Types.MenuCategory {
    if (not isMenuAdmin(caller)) Runtime.trap("Unauthorized");
    let cat = MenuLib.addCategory(menuCategories, nextMenuIds[0], name, description, emoji);
    nextMenuIds[0] += 1;
    cat;
  };

  public shared ({ caller }) func addMenuItem(
    categoryId : Nat,
    name : Text,
    description : Text,
    price : Nat,
    imageUrl : Text,
    tags : [Common.DietaryTag],
    calories : ?Nat,
  ) : async Types.MenuItem {
    if (not isMenuAdmin(caller)) Runtime.trap("Unauthorized");
    let item = MenuLib.addItem(menuItems, nextMenuIds[1], categoryId, name, description, price, imageUrl, tags, calories);
    nextMenuIds[1] += 1;
    item;
  };

  public shared ({ caller }) func updateMenuItem(item : Types.MenuItem) : async Bool {
    if (not isMenuAdmin(caller)) Runtime.trap("Unauthorized");
    MenuLib.updateItem(menuItems, item);
  };

  public shared ({ caller }) func toggleItemAvailability(id : Nat) : async Bool {
    if (not isMenuAdmin(caller)) Runtime.trap("Unauthorized");
    MenuLib.toggleAvailability(menuItems, id);
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async Bool {
    if (not isMenuAdmin(caller)) Runtime.trap("Unauthorized");
    MenuLib.deleteItem(menuItems, id);
  };
};
