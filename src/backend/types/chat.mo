import Common "common";

module {
  public type MessageId = Common.MessageId;
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  // Chat message record (immutable once stored)
  public type ChatMessage = {
    id : MessageId;
    sender : UserId;
    senderUsername : Text;
    body : Text;
    timestamp : Timestamp;
  };
};
