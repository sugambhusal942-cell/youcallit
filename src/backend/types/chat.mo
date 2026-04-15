import Common "common";
import Map "mo:core/Map";

module {
  public type SenderRole = {
    #customer;
    #chef;
  };

  public type ChatMessage = {
    id : Nat;
    orderId : ?Nat;
    reservationId : ?Nat;
    senderId : Common.UserId;
    senderRole : SenderRole;
    content : Text;
    timestamp : Common.Timestamp;
    isRead : Bool;
  };

  public type ChatThread = {
    id : Nat;
    orderId : Nat;
    customerId : Common.UserId;
    messages : [ChatMessage];
    lastActivity : Common.Timestamp;
    isOpen : Bool;
  };

  public type ChatThreadMap = Map.Map<Nat, ChatThread>;
};
