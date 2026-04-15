import Common "common";

module {
  public type MenuCategory = {
    id : Nat;
    name : Text;
    description : Text;
    emoji : Text;
  };

  public type MenuItem = {
    id : Nat;
    categoryId : Nat;
    name : Text;
    description : Text;
    price : Nat; // in cents
    imageUrl : Text;
    tags : [Common.DietaryTag];
    isAvailable : Bool;
    isPopular : Bool;
    calories : ?Nat;
  };
};
