import Types "../types/chat";
import Common "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";

module {
  func findOrCreateThread(
    threads : Map.Map<Nat, Types.ChatThread>,
    nextThreadId : Nat,
    orderId : Nat,
    customerId : Common.UserId,
    now : Common.Timestamp,
  ) : (Types.ChatThread, Nat) {
    // Search existing threads by orderId
    var found : ?Types.ChatThread = null;
    for ((_, t) in threads.entries()) {
      if (t.orderId == orderId) { found := ?t };
    };
    switch (found) {
      case (?t) (t, nextThreadId); // no new thread created, counter unchanged
      case null {
        let t : Types.ChatThread = {
          id = nextThreadId;
          orderId;
          customerId;
          messages = [];
          lastActivity = now;
          isOpen = true;
        };
        threads.add(nextThreadId, t);
        (t, nextThreadId + 1) // counter incremented
      };
    }
  };

  // Returns (message, newNextMsgId, newNextThreadId)
  public func sendMessage(
    threads : Map.Map<Nat, Types.ChatThread>,
    nextMsgId : Nat,
    nextThreadId : Nat,
    orderId : Nat,
    customerId : Common.UserId,
    senderId : Common.UserId,
    senderRole : Types.SenderRole,
    content : Text,
    now : Common.Timestamp,
  ) : (Types.ChatMessage, Nat, Nat) {
    let (thread, newNextThreadId) = findOrCreateThread(threads, nextThreadId, orderId, customerId, now);
    let msg : Types.ChatMessage = {
      id = nextMsgId;
      orderId = ?orderId;
      reservationId = null;
      senderId;
      senderRole;
      content;
      timestamp = now;
      isRead = false;
    };
    let updatedMessages = thread.messages.concat([msg]);
    let updated : Types.ChatThread = { thread with messages = updatedMessages; lastActivity = now };
    threads.add(thread.id, updated);
    (msg, nextMsgId + 1, newNextThreadId)
  };

  public func getThread(threads : Map.Map<Nat, Types.ChatThread>, threadId : Nat) : ?Types.ChatThread {
    threads.get(threadId);
  };

  public func getThreadByOrder(threads : Map.Map<Nat, Types.ChatThread>, orderId : Nat) : ?Types.ChatThread {
    var result : ?Types.ChatThread = null;
    for ((_, t) in threads.entries()) {
      if (t.orderId == orderId) { result := ?t };
    };
    result;
  };

  public func getNewMessages(threads : Map.Map<Nat, Types.ChatThread>, threadId : Nat, lastMessageId : Nat) : [Types.ChatMessage] {
    switch (threads.get(threadId)) {
      case null [];
      case (?t) t.messages.filter(func(m) { m.id > lastMessageId });
    }
  };

  public func markMessagesRead(threads : Map.Map<Nat, Types.ChatThread>, threadId : Nat, _reader : Common.UserId) : Bool {
    switch (threads.get(threadId)) {
      case null false;
      case (?t) {
        let updated : Types.ChatThread = {
          t with
          messages = t.messages.map<Types.ChatMessage, Types.ChatMessage>(
            func(m) { { m with isRead = true } }
          )
        };
        threads.add(threadId, updated);
        true
      };
    }
  };

  public func getAllOpenThreads(threads : Map.Map<Nat, Types.ChatThread>) : [Types.ChatThread] {
    let result = List.empty<Types.ChatThread>();
    for ((_, t) in threads.entries()) {
      if (t.isOpen) { result.add(t) };
    };
    result.toArray();
  };
};
