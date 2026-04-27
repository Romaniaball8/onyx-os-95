import List "mo:core/List";
import Principal "mo:core/Principal";
import Types "../types/users";

module {
  public type UserList = List.List<Types.UserInternal>;

  // Returns whether any users exist
  public func hasUsers(users : UserList) : Bool {
    not users.isEmpty();
  };

  // Finds a user by their principal id
  public func findById(users : UserList, id : Types.UserId) : ?Types.UserInternal {
    users.find(func(u) { Principal.equal(u.id, id) });
  };

  // Finds a user by their username (case-sensitive)
  public func findByUsername(users : UserList, username : Text) : ?Types.UserInternal {
    users.find(func(u) { u.username == username });
  };

  // Creates a new user record (does NOT add to the list)
  public func newUser(
    id : Types.UserId,
    username : Text,
    passwordHash : Text,
    role : Types.Role,
    now : Types.Timestamp,
  ) : Types.UserInternal {
    {
      id;
      var username;
      var passwordHash;
      var role;
      var bio = "";
      var biography = "";
      var avatarUrl = "";
      var usernameEffect = #None;
      var textPlate = #None;
      var lastSeen = now;
    };
  };

  // Converts internal user to public record
  public func toPublic(user : Types.UserInternal, onlineThreshold : Types.Timestamp) : Types.User {
    {
      id = user.id;
      username = user.username;
      role = user.role;
      bio = user.bio;
      biography = user.biography;
      avatarUrl = user.avatarUrl;
      usernameEffect = user.usernameEffect;
      textPlate = user.textPlate;
      lastSeen = user.lastSeen;
      isOnline = user.lastSeen >= onlineThreshold;
    };
  };

  // Converts all users to public records
  public func toPublicAll(users : UserList, onlineThreshold : Types.Timestamp) : [Types.User] {
    users.map<Types.UserInternal, Types.User>(func(u) { toPublic(u, onlineThreshold) }).toArray();
  };

  // Verifies password hash matches
  public func checkPassword(user : Types.UserInternal, passwordHash : Text) : Bool {
    user.passwordHash == passwordHash;
  };

  // Updates last-seen timestamp
  public func heartbeat(user : Types.UserInternal, now : Types.Timestamp) {
    user.lastSeen := now;
  };

  // Returns true if caller is Owner or Admin
  public func isPrivileged(user : Types.UserInternal) : Bool {
    switch (user.role) {
      case (#Owner) true;
      case (#Admin) true;
      case (#User) false;
    };
  };
};
