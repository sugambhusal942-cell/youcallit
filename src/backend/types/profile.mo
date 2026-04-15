import Common "common";

module {
  public type CustomerProfile = {
    id : Common.UserId;
    name : Text;
    phone : Text;
    email : Text;
    favoriteItems : [Nat]; // list of menuItemIds
    dietaryPreferences : [Common.DietaryTag];
  };
};
