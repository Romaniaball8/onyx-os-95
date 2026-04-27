import List "mo:core/List";
import Types "../types/chat";

module {
  public type MessageList = List.List<Types.ChatMessage>;

  // Creates a new chat message record
  public func newMessage(
    id : Types.MessageId,
    sender : Types.UserId,
    senderUsername : Text,
    body : Text,
    now : Types.Timestamp,
  ) : Types.ChatMessage {
    { id; sender; senderUsername; body; timestamp = now };
  };

  // Returns the most recent N messages (newest last, oldest dropped when over limit)
  public func recent(messages : MessageList, limit : Nat) : [Types.ChatMessage] {
    let total = messages.size();
    if (total <= limit) {
      messages.toArray();
    } else {
      let start : Nat = total - limit : Nat;
      messages.sliceToArray(start, total);
    };
  };
};
