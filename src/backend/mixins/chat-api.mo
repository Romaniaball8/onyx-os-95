import List "mo:core/List";
import ChatTypes "../types/chat";
import UserTypes "../types/users";
import ChatLib "../lib/chat";
import UserLib "../lib/users";

module ChatApi {
  public type MessageList = List.List<ChatTypes.ChatMessage>;
  public type UserList = List.List<UserTypes.UserInternal>;
  public type Counter = { var value : Nat };

  // Send a message to the global chat. Caller must be registered.
  public func sendMessage(
    messages : MessageList,
    users : UserList,
    counter : Counter,
    caller : ChatTypes.UserId,
    body : Text,
    now : ChatTypes.Timestamp,
  ) : { #ok : ChatTypes.ChatMessage; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("User not registered") };
      case (?user) {
        if (body.size() == 0) {
          return #err("Message body cannot be empty");
        };
        let id = counter.value;
        counter.value += 1;
        let msg = ChatLib.newMessage(id, caller, user.username, body, now);
        messages.add(msg);
        #ok(msg);
      };
    };
  };

  // Get the most recent chat messages (up to limit, max 500 for shared persistence).
  public func getMessages(
    messages : MessageList,
    limit : Nat,
  ) : [ChatTypes.ChatMessage] {
    let cap = if (limit > 500) 500 else limit;
    ChatLib.recent(messages, cap);
  };
};
