import List "mo:core/List";
import FriendTypes "../types/friends";
import UserTypes "../types/users";
import FriendLib "../lib/friends";
import UserLib "../lib/users";

module FriendsApi {
  public type FriendRequestList = List.List<FriendTypes.FriendRequest>;
  public type PrivateMessageList = List.List<FriendTypes.PrivateMessageInternal>;
  public type UserList = List.List<UserTypes.UserInternal>;
  public type Counter = { var value : Nat };

  // Send a friend request from caller to toUsername.
  // Fails if: not registered, target not found, already friends or request pending.
  public func sendFriendRequest(
    requests : FriendRequestList,
    users : UserList,
    caller : UserTypes.UserId,
    toUsername : Text,
    now : FriendTypes.Timestamp,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Caller not registered") };
      case (?callerUser) {
        if (callerUser.username == toUsername) {
          return #err("Cannot send friend request to yourself");
        };
        switch (UserLib.findByUsername(users, toUsername)) {
          case null { #err("User not found") };
          case (?_) {
            switch (FriendLib.findRequest(requests, callerUser.username, toUsername)) {
              case (?existing) {
                switch (existing.status) {
                  case (#Pending) { return #err("Friend request already pending") };
                  case (#Accepted) { return #err("Already friends") };
                  case (#Rejected) {}; // allow re-sending after rejection
                };
              };
              case null {};
            };
            requests.add({
              fromUsername = callerUser.username;
              toUsername;
              status = #Pending;
              timestamp = now;
            });
            #ok;
          };
        };
      };
    };
  };

  // Accept a friend request from fromUsername to caller.
  public func acceptFriendRequest(
    requests : FriendRequestList,
    users : UserList,
    caller : UserTypes.UserId,
    fromUsername : Text,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Caller not registered") };
      case (?callerUser) {
        let toUsername = callerUser.username;
        var found = false;
        requests.mapInPlace(func(r) {
          if (r.fromUsername == fromUsername and r.toUsername == toUsername and r.status == #Pending) {
            found := true;
            { r with status = #Accepted };
          } else { r };
        });
        if (found) #ok else #err("No pending friend request from that user");
      };
    };
  };

  // Reject a friend request from fromUsername to caller.
  public func rejectFriendRequest(
    requests : FriendRequestList,
    users : UserList,
    caller : UserTypes.UserId,
    fromUsername : Text,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Caller not registered") };
      case (?callerUser) {
        let toUsername = callerUser.username;
        var found = false;
        requests.mapInPlace(func(r) {
          if (r.fromUsername == fromUsername and r.toUsername == toUsername and r.status == #Pending) {
            found := true;
            { r with status = #Rejected };
          } else { r };
        });
        if (found) #ok else #err("No pending friend request from that user");
      };
    };
  };

  // Get all friend requests involving the caller (sent and received).
  public func getFriendRequests(
    requests : FriendRequestList,
    users : UserList,
    caller : UserTypes.UserId,
  ) : [FriendTypes.FriendRequest] {
    switch (UserLib.findById(users, caller)) {
      case null { [] };
      case (?callerUser) {
        FriendLib.getRequestsFor(requests, callerUser.username);
      };
    };
  };

  // Get accepted friends as User records.
  public func getFriends(
    requests : FriendRequestList,
    users : UserList,
    caller : UserTypes.UserId,
    onlineThreshold : UserTypes.Timestamp,
  ) : [UserTypes.User] {
    switch (UserLib.findById(users, caller)) {
      case null { [] };
      case (?callerUser) {
        let friendUsernames = FriendLib.getFriendUsernames(requests, callerUser.username);
        let result = List.empty<UserTypes.User>();
        for (name in friendUsernames.values()) {
          switch (UserLib.findByUsername(users, name)) {
            case null {};
            case (?u) { result.add(UserLib.toPublic(u, onlineThreshold)) };
          };
        };
        result.toArray();
      };
    };
  };

  // Send a private message to toUsername. Caller must be registered.
  public func sendPrivateMessage(
    pms : PrivateMessageList,
    users : UserList,
    counter : Counter,
    caller : UserTypes.UserId,
    toUsername : Text,
    body : Text,
    now : FriendTypes.Timestamp,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Caller not registered") };
      case (?callerUser) {
        switch (UserLib.findByUsername(users, toUsername)) {
          case null { #err("Recipient not found") };
          case (?_) {
            if (body.size() == 0) {
              return #err("Message cannot be empty");
            };
            let id = counter.value;
            counter.value += 1;
            let pm = FriendLib.newPM(id, callerUser.username, toUsername, body, now);
            pms.add(pm);
            #ok;
          };
        };
      };
    };
  };

  // Get private messages between caller and withUsername.
  public func getPrivateMessages(
    pms : PrivateMessageList,
    users : UserList,
    caller : UserTypes.UserId,
    withUsername : Text,
  ) : [FriendTypes.PrivateMessage] {
    switch (UserLib.findById(users, caller)) {
      case null { [] };
      case (?callerUser) {
        FriendLib.getConversation(pms, callerUser.username, withUsername);
      };
    };
  };

  // Mark a private message as read (caller must be the recipient).
  public func markPrivateMessageRead(
    pms : PrivateMessageList,
    users : UserList,
    caller : UserTypes.UserId,
    id : FriendTypes.PrivateMessageId,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Caller not registered") };
      case (?callerUser) {
        switch (pms.find(func(m) { m.id == id and m.toUsername == callerUser.username })) {
          case null { #err("Message not found or not authorized") };
          case (?msg) {
            msg.isRead := true;
            #ok;
          };
        };
      };
    };
  };
};
