import Types "../types/menu";
import Common "../types/common";
import List "mo:core/List";

module {
  // Seed data helpers - categories
  public func seedCategories(categories : List.List<Types.MenuCategory>) {
    categories.add({ id = 1; name = "Starters"; description = "Begin your journey with our curated small plates"; emoji = "🥗" });
    categories.add({ id = 2; name = "Mains"; description = "Signature entrées crafted to your desire"; emoji = "🍽️" });
    categories.add({ id = 3; name = "Desserts"; description = "Sweet finales that leave you speechless"; emoji = "🍮" });
    categories.add({ id = 4; name = "Drinks"; description = "Handcrafted beverages and fine selections"; emoji = "🍷" });
    categories.add({ id = 5; name = "Chef Specials"; description = "Exclusive creations — whatever you crave, we deliver"; emoji = "👨‍🍳" });
  };

  // Seed data helpers - items
  public func seedItems(items : List.List<Types.MenuItem>) {
    // Starters (categoryId = 1)
    items.add({ id = 1; categoryId = 1; name = "Truffle Arancini"; description = "Crispy risotto balls with black truffle and parmesan, served with saffron aioli"; price = 1600; imageUrl = ""; tags = [#chefsSpecial, #vegetarian]; isAvailable = true; isPopular = true; calories = ?320 });
    items.add({ id = 2; categoryId = 1; name = "Tuna Tataki"; description = "Seared yellowfin tuna, sesame crust, yuzu ponzu, microgreens"; price = 2200; imageUrl = ""; tags = [#glutenFree]; isAvailable = true; isPopular = true; calories = ?280 });
    items.add({ id = 3; categoryId = 1; name = "Burrata & Heritage Tomatoes"; description = "House-made burrata, heirloom tomatoes, basil oil, fleur de sel"; price = 1800; imageUrl = ""; tags = [#vegetarian, #glutenFree]; isAvailable = true; isPopular = false; calories = ?350 });
    items.add({ id = 4; categoryId = 1; name = "Wagyu Beef Sliders"; description = "Mini wagyu patties, aged cheddar, truffle mayo on brioche buns"; price = 2600; imageUrl = ""; tags = [#chefsSpecial]; isAvailable = true; isPopular = true; calories = ?480 });
    items.add({ id = 5; categoryId = 1; name = "Edamame Dumplings"; description = "Steamed gyoza filled with edamame and shiitake, ginger soy dip"; price = 1400; imageUrl = ""; tags = [#vegan]; isAvailable = true; isPopular = false; calories = ?260 });
    items.add({ id = 6; categoryId = 1; name = "Lobster Bisque"; description = "Velvety lobster bisque, cognac cream, chive oil, sourdough crostini"; price = 2400; imageUrl = ""; tags = [#chefsSpecial]; isAvailable = true; isPopular = true; calories = ?410 });
    // Mains (categoryId = 2)
    items.add({ id = 7; categoryId = 2; name = "Wagyu Ribeye"; description = "250g A5 wagyu ribeye, bone marrow butter, roasted garlic, truffle fries"; price = 8500; imageUrl = ""; tags = [#chefsSpecial, #glutenFree]; isAvailable = true; isPopular = true; calories = ?920 });
    items.add({ id = 8; categoryId = 2; name = "Pan-Seared Sea Bass"; description = "Mediterranean sea bass, saffron beurre blanc, fennel confit, samphire"; price = 4800; imageUrl = ""; tags = [#glutenFree]; isAvailable = true; isPopular = true; calories = ?560 });
    items.add({ id = 9; categoryId = 2; name = "Black Truffle Risotto"; description = "Arborio rice, Périgord black truffle, aged parmigiano, white wine"; price = 3800; imageUrl = ""; tags = [#vegetarian, #chefsSpecial]; isAvailable = true; isPopular = true; calories = ?680 });
    items.add({ id = 10; categoryId = 2; name = "Duck Confit"; description = "48-hour duck leg confit, cherry jus, parsnip purée, roasted beets"; price = 4200; imageUrl = ""; tags = [#glutenFree]; isAvailable = true; isPopular = false; calories = ?740 });
    items.add({ id = 11; categoryId = 2; name = "Lamb Rack"; description = "Herb-crusted rack of lamb, pistachio gremolata, ratatouille, rosemary jus"; price = 5600; imageUrl = ""; tags = []; isAvailable = true; isPopular = true; calories = ?820 });
    items.add({ id = 12; categoryId = 2; name = "Vegan Wellington"; description = "Beetroot and lentil en croûte, mushroom duxelle, truffle-scented jus"; price = 3400; imageUrl = ""; tags = [#vegan, #chefsSpecial]; isAvailable = true; isPopular = false; calories = ?580 });
    // Desserts (categoryId = 3)
    items.add({ id = 13; categoryId = 3; name = "Chocolate Sphere"; description = "Dark chocolate shell, salted caramel mousse, hot caramel poured tableside"; price = 1800; imageUrl = ""; tags = [#vegetarian, #chefsSpecial]; isAvailable = true; isPopular = true; calories = ?520 });
    items.add({ id = 14; categoryId = 3; name = "Yuzu Tart"; description = "Delicate yuzu curd, Italian meringue, crystallized citrus, edible flowers"; price = 1600; imageUrl = ""; tags = [#vegetarian]; isAvailable = true; isPopular = true; calories = ?440 });
    items.add({ id = 15; categoryId = 3; name = "Pistachio Soufflé"; description = "Classic French soufflé with pistachio praline, vanilla crème anglaise"; price = 2000; imageUrl = ""; tags = [#vegetarian]; isAvailable = true; isPopular = false; calories = ?380 });
    items.add({ id = 16; categoryId = 3; name = "Mango Sorbet Trio"; description = "Alphonso mango, coconut, passionfruit sorbets with crystallized ginger"; price = 1200; imageUrl = ""; tags = [#vegan, #glutenFree]; isAvailable = true; isPopular = false; calories = ?220 });
    items.add({ id = 17; categoryId = 3; name = "Cheese Board"; description = "Artisan selection of five aged cheeses, honeycomb, candied walnuts, crackers"; price = 2400; imageUrl = ""; tags = [#vegetarian]; isAvailable = true; isPopular = false; calories = ?620 });
    // Drinks (categoryId = 4)
    items.add({ id = 18; categoryId = 4; name = "Champagne Flute"; description = "Moët & Chandon Brut Impérial, chilled to perfection"; price = 1800; imageUrl = ""; tags = [#vegan]; isAvailable = true; isPopular = true; calories = ?90 });
    items.add({ id = 19; categoryId = 4; name = "Signature Cocktail"; description = "youCallIT house mix — elderflower, gin, cucumber, premium tonic"; price = 1600; imageUrl = ""; tags = [#vegan]; isAvailable = true; isPopular = true; calories = ?180 });
    items.add({ id = 20; categoryId = 4; name = "Reserve Red Wine"; description = "Sommelier-selected Cabernet Sauvignon by the glass"; price = 2200; imageUrl = ""; tags = [#vegan, #glutenFree]; isAvailable = true; isPopular = false; calories = ?125 });
    items.add({ id = 21; categoryId = 4; name = "Cold Brew Highball"; description = "Single-origin cold brew, sparkling water, orange zest, dark chocolate bitters"; price = 800; imageUrl = ""; tags = [#vegan]; isAvailable = true; isPopular = false; calories = ?80 });
    items.add({ id = 22; categoryId = 4; name = "Fresh Pressed Juice"; description = "Daily seasonal blend — ask your server for today's selection"; price = 700; imageUrl = ""; tags = [#vegan, #glutenFree]; isAvailable = true; isPopular = false; calories = ?110 });
    // Chef Specials (categoryId = 5)
    items.add({ id = 23; categoryId = 5; name = "Custom Creation"; description = "Tell us your craving and the chef will craft it — youCallIT, we make it"; price = 0; imageUrl = ""; tags = [#chefsSpecial]; isAvailable = true; isPopular = true; calories = null });
    items.add({ id = 24; categoryId = 5; name = "Omakase Tasting Menu"; description = "7-course chef's choice experience, seasonal and market-driven (per person)"; price = 18000; imageUrl = ""; tags = [#chefsSpecial]; isAvailable = true; isPopular = true; calories = null });
    items.add({ id = 25; categoryId = 5; name = "World Cuisine Request"; description = "Craving Japanese, Mexican, Indian, French? Name it — we prepare it"; price = 0; imageUrl = ""; tags = [#chefsSpecial]; isAvailable = true; isPopular = false; calories = null });
    items.add({ id = 26; categoryId = 5; name = "Dietary-Tailored Meal"; description = "Keto, vegan, gluten-free, or any restriction — fully customized just for you"; price = 0; imageUrl = ""; tags = [#chefsSpecial, #vegan, #glutenFree]; isAvailable = true; isPopular = false; calories = null });
  };

  public func getCategories(categories : List.List<Types.MenuCategory>) : [Types.MenuCategory] {
    categories.toArray();
  };

  public func getItems(items : List.List<Types.MenuItem>) : [Types.MenuItem] {
    items.toArray();
  };

  public func getItemsByCategory(items : List.List<Types.MenuItem>, categoryId : Nat) : [Types.MenuItem] {
    items.filter(func(item) { item.categoryId == categoryId }).toArray();
  };

  public func searchItems(items : List.List<Types.MenuItem>, searchTerm : Text) : [Types.MenuItem] {
    let lower = searchTerm.toLower();
    items.filter(func(item) {
      item.name.toLower().contains(#text lower) or item.description.toLower().contains(#text lower)
    }).toArray();
  };

  public func getItem(items : List.List<Types.MenuItem>, id : Nat) : ?Types.MenuItem {
    items.find(func(item) { item.id == id });
  };

  public func addCategory(categories : List.List<Types.MenuCategory>, nextId : Nat, name : Text, description : Text, emoji : Text) : Types.MenuCategory {
    let cat : Types.MenuCategory = { id = nextId; name; description; emoji };
    categories.add(cat);
    cat;
  };

  public func addItem(items : List.List<Types.MenuItem>, nextId : Nat, categoryId : Nat, name : Text, description : Text, price : Nat, imageUrl : Text, tags : [Common.DietaryTag], calories : ?Nat) : Types.MenuItem {
    let item : Types.MenuItem = {
      id = nextId;
      categoryId;
      name;
      description;
      price;
      imageUrl;
      tags;
      isAvailable = true;
      isPopular = false;
      calories;
    };
    items.add(item);
    item;
  };

  public func updateItem(items : List.List<Types.MenuItem>, updated : Types.MenuItem) : Bool {
    var found = false;
    items.mapInPlace(func(item) {
      if (item.id == updated.id) { found := true; updated } else { item }
    });
    found;
  };

  public func toggleAvailability(items : List.List<Types.MenuItem>, id : Nat) : Bool {
    var found = false;
    items.mapInPlace(func(item) {
      if (item.id == id) {
        found := true;
        { item with isAvailable = not item.isAvailable }
      } else { item }
    });
    found;
  };

  public func deleteItem(items : List.List<Types.MenuItem>, id : Nat) : Bool {
    let before = items.size();
    let filtered = items.filter(func(item) { item.id != id });
    items.clear();
    items.append(filtered);
    items.size() < before;
  };
};
