import Types "../types/chat";
import ChatLib "../lib/chat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

mixin (
  chatThreads : Map.Map<Nat, Types.ChatThread>,
  nextChatIds : [var Nat],
) {
  // nextChatIds[0] = nextChatMsgId, nextChatIds[1] = nextChatThreadId

  public shared ({ caller }) func sendMessage(
    orderId : Nat,
    content : Text,
  ) : async Types.ChatMessage {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    let (msg, newMsgId, newThreadId) = ChatLib.sendMessage(
      chatThreads, nextChatIds[0], nextChatIds[1],
      orderId, caller, caller, #customer, content, Time.now()
    );
    nextChatIds[0] := newMsgId;
    nextChatIds[1] := newThreadId;
    msg;
  };

  public query func getThread(threadId : Nat) : async ?Types.ChatThread {
    ChatLib.getThread(chatThreads, threadId);
  };

  public query func getThreadByOrder(orderId : Nat) : async ?Types.ChatThread {
    ChatLib.getThreadByOrder(chatThreads, orderId);
  };

  public query func getNewMessages(threadId : Nat, lastMessageId : Nat) : async [Types.ChatMessage] {
    ChatLib.getNewMessages(chatThreads, threadId, lastMessageId);
  };

  public shared ({ caller }) func markMessagesRead(threadId : Nat) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    ChatLib.markMessagesRead(chatThreads, threadId, caller);
  };

  // Admin / Chef APIs
  public shared ({ caller }) func getAllOpenThreads() : async [Types.ChatThread] {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    ChatLib.getAllOpenThreads(chatThreads);
  };

  public shared ({ caller }) func sendChefMessage(
    orderId : Nat,
    content : Text,
  ) : async Types.ChatMessage {
    if (not caller.isController()) Runtime.trap("Unauthorized");
    let (msg, newMsgId, newThreadId) = ChatLib.sendMessage(
      chatThreads, nextChatIds[0], nextChatIds[1],
      orderId, caller, caller, #chef, content, Time.now()
    );
    nextChatIds[0] := newMsgId;
    nextChatIds[1] := newThreadId;
    msg;
  };
};
