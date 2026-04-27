import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  // Friend request status
  public type FriendRequestStatus = { #Pending; #Accepted; #Rejected };

  // Friend request record
  public type FriendRequest = {
    fromUsername : Text;
    toUsername : Text;
    status : FriendRequestStatus;
    timestamp : Timestamp;
  };

  // Private message id type
  public type PrivateMessageId = Nat;

  // Internal private message (mutable isRead)
  public type PrivateMessageInternal = {
    id : PrivateMessageId;
    fromUsername : Text;
    toUsername : Text;
    body : Text;
    timestamp : Timestamp;
    var isRead : Bool;
  };

  // Public private message (shareable)
  public type PrivateMessage = {
    id : PrivateMessageId;
    fromUsername : Text;
    toUsername : Text;
    body : Text;
    timestamp : Timestamp;
    isRead : Bool;
  };
};
