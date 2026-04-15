import Types "../types/profile";
import Common "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";

module {
  public func getProfile(profiles : Map.Map<Common.UserId, Types.CustomerProfile>, id : Common.UserId) : ?Types.CustomerProfile {
    profiles.get(id);
  };

  public func upsertProfile(
    profiles : Map.Map<Common.UserId, Types.CustomerProfile>,
    id : Common.UserId,
    name : Text,
    phone : Text,
    email : Text,
    dietaryPreferences : [Common.DietaryTag],
  ) : Types.CustomerProfile {
    let existing = profiles.get(id);
    let profile : Types.CustomerProfile = switch (existing) {
      case (?p) { { p with name; phone; email; dietaryPreferences } };
      case null { { id; name; phone; email; favoriteItems = []; dietaryPreferences } };
    };
    profiles.add(id, profile);
    profile;
  };

  public func addFavoriteItem(profiles : Map.Map<Common.UserId, Types.CustomerProfile>, id : Common.UserId, menuItemId : Nat) : Bool {
    switch (profiles.get(id)) {
      case null false;
      case (?p) {
        switch (p.favoriteItems.find(func(x) { x == menuItemId })) {
          case (?_) false; // already favorited
          case null {
            let updated : Types.CustomerProfile = { p with favoriteItems = p.favoriteItems.concat([menuItemId]) };
            profiles.add(id, updated);
            true
          };
        }
      };
    }
  };

  public func removeFavoriteItem(profiles : Map.Map<Common.UserId, Types.CustomerProfile>, id : Common.UserId, menuItemId : Nat) : Bool {
    switch (profiles.get(id)) {
      case null false;
      case (?p) {
        let filtered = p.favoriteItems.filter(func(x) { x != menuItemId });
        let updated : Types.CustomerProfile = { p with favoriteItems = filtered };
        profiles.add(id, updated);
        true
      };
    }
  };

  public func getAllCustomers(profiles : Map.Map<Common.UserId, Types.CustomerProfile>) : [Types.CustomerProfile] {
    let result = List.empty<Types.CustomerProfile>();
    for ((_, p) in profiles.entries()) {
      result.add(p);
    };
    result.toArray();
  };
};
