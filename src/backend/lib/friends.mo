import List "mo:core/List";
import Types "../types/friends";

module {
  public type FriendRequestList = List.List<Types.FriendRequest>;
  public type PrivateMessageList = List.List<Types.PrivateMessageInternal>;

  // Converts internal private message to shareable record
  public func pmToPublic(pm : Types.PrivateMessageInternal) : Types.PrivateMessage {
    {
      id = pm.id;
      fromUsername = pm.fromUsername;
      toUsername = pm.toUsername;
      body = pm.body;
      timestamp = pm.timestamp;
      isRead = pm.isRead;
    };
  };

  // Gets friend requests involving a username (both sent and received)
  public func getRequestsFor(requests : FriendRequestList, username : Text) : [Types.FriendRequest] {
    requests
      .filter(func(r) { r.fromUsername == username or r.toUsername == username })
      .toArray();
  };

  // Gets accepted friends as list of usernames for a user
  public func getFriendUsernames(requests : FriendRequestList, username : Text) : [Text] {
    requests
      .filter(func(r) {
        switch (r.status) {
          case (#Accepted) r.fromUsername == username or r.toUsername == username;
          case (_) false;
        };
      })
      .map<Types.FriendRequest, Text>(func(r) {
        if (r.fromUsername == username) r.toUsername else r.fromUsername
      })
      .toArray();
  };

  // Finds existing request between two users (in either direction)
  public func findRequest(requests : FriendRequestList, from : Text, to : Text) : ?Types.FriendRequest {
    requests.find(func(r) {
      (r.fromUsername == from and r.toUsername == to) or
      (r.fromUsername == to and r.toUsername == from)
    });
  };

  // Get private messages between two users
  public func getConversation(pms : PrivateMessageList, user1 : Text, user2 : Text) : [Types.PrivateMessage] {
    pms
      .filter(func(m) {
        (m.fromUsername == user1 and m.toUsername == user2) or
        (m.fromUsername == user2 and m.toUsername == user1)
      })
      .map<Types.PrivateMessageInternal, Types.PrivateMessage>(func(m) { pmToPublic(m) })
      .toArray();
  };

  // Creates a new private message (does NOT add to list)
  public func newPM(
    id : Types.PrivateMessageId,
    from : Text,
    to : Text,
    body : Text,
    now : Types.Timestamp,
  ) : Types.PrivateMessageInternal {
    {
      id;
      fromUsername = from;
      toUsername = to;
      body;
      timestamp = now;
      var isRead = false;
    };
  };
};
