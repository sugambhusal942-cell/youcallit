import Types "../types/profile";
import Common "../types/common";
import ProfileLib "../lib/profile";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  profiles : Map.Map<Common.UserId, Types.CustomerProfile>,
) {
  public shared ({ caller }) func getMyProfile() : async ?Types.CustomerProfile {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    ProfileLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func updateProfile(
    name : Text,
    phone : Text,
    email : Text,
    dietaryPreferences : [Common.DietaryTag],
  ) : async Types.CustomerProfile {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    ProfileLib.upsertProfile(profiles, caller, name, phone, email, dietaryPreferences);
  };

  public shared ({ caller }) func addFavoriteItem(menuItemId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    ProfileLib.addFavoriteItem(profiles, caller, menuItemId);
  };

  public shared ({ caller }) func removeFavoriteItem(menuItemId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    ProfileLib.removeFavoriteItem(profiles, caller, menuItemId);
  };

  // Admin API
  public shared ({ caller }) func getAllCustomers() : async [Types.CustomerProfile] {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    ProfileLib.getAllCustomers(profiles);
  };
};
