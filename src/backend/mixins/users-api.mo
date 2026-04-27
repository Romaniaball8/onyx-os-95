import List "mo:core/List";
import Principal "mo:core/Principal";
import UserTypes "../types/users";
import UserLib "../lib/users";

module UsersApi {
  public type UserList = List.List<UserTypes.UserInternal>;
  public type NextId = { var value : Nat };

  // Register a new account. "Mr.Romaniaman" always gets Owner role.
  // Returns error if username already taken or principal already registered.
  public func register(
    users : UserList,
    caller : UserTypes.UserId,
    username : Text,
    passwordHash : Text,
    now : UserTypes.Timestamp,
  ) : UserTypes.AuthResult {
    if (caller.isAnonymous()) {
      return #err("Anonymous principals cannot register");
    };
    switch (UserLib.findById(users, caller)) {
      case (?_) { return #err("Principal already registered") };
      case null {};
    };
    switch (UserLib.findByUsername(users, username)) {
      case (?_) { return #err("Username already taken") };
      case null {};
    };
    if (username.size() == 0) {
      return #err("Username cannot be empty");
    };
    // Only "Mr.Romaniaman" gets Owner; no other new user ever becomes Owner
    let role : UserTypes.Role = if (username == "Mr.Romaniaman") #Owner else #User;
    let user = UserLib.newUser(caller, username, passwordHash, role, now);
    users.add(user);
    #ok(UserLib.toPublic(user, now));
  };

  // Login: verify principal + password, return user record.
  public func login(
    users : UserList,
    caller : UserTypes.UserId,
    passwordHash : Text,
    now : UserTypes.Timestamp,
  ) : UserTypes.AuthResult {
    switch (UserLib.findById(users, caller)) {
      case null { #err("User not found") };
      case (?user) {
        if (not UserLib.checkPassword(user, passwordHash)) {
          return #err("Invalid password");
        };
        // Ensure Mr.Romaniaman is always Owner
        if (user.username == "Mr.Romaniaman") {
          user.role := #Owner;
        };
        UserLib.heartbeat(user, now);
        #ok(UserLib.toPublic(user, now));
      };
    };
  };

  // Get public user profile by principal.
  public func getProfile(
    users : UserList,
    id : UserTypes.UserId,
    onlineThreshold : UserTypes.Timestamp,
  ) : ?UserTypes.User {
    switch (UserLib.findById(users, id)) {
      case null null;
      case (?user) ?UserLib.toPublic(user, onlineThreshold);
    };
  };

  // Update caller's own profile fields.
  // textPlate in ProfileUpdate: if null, no change. If Some, only Owner/Admin can change it for themselves.
  // Actually any user can set their own textPlate per requirements; only Owner/Admin can set it for OTHERS via setTextPlate.
  public func updateProfile(
    users : UserList,
    caller : UserTypes.UserId,
    update : UserTypes.ProfileUpdate,
  ) : UserTypes.AuthResult {
    switch (UserLib.findById(users, caller)) {
      case null { #err("User not found") };
      case (?user) {
        // Check if the new username is taken by someone else
        if (user.username != update.username) {
          switch (UserLib.findByUsername(users, update.username)) {
            case (?other) {
              if (not Principal.equal(other.id, caller)) {
                return #err("Username already taken");
              };
            };
            case null {};
          };
        };
        if (update.username.size() == 0) {
          return #err("Username cannot be empty");
        };
        user.username := update.username;
        user.bio := update.bio;
        user.biography := update.biography;
        user.avatarUrl := update.avatarUrl;
        user.usernameEffect := update.usernameEffect;
        // Only Owner/Admin can set textPlate; users' own textPlate requests are honoured too
        switch (update.textPlate) {
          case null {};
          case (?plate) { user.textPlate := plate };
        };
        #ok(UserLib.toPublic(user, user.lastSeen));
      };
    };
  };

  // List all users (public fields only).
  public func listUsers(
    users : UserList,
    onlineThreshold : UserTypes.Timestamp,
  ) : [UserTypes.User] {
    UserLib.toPublicAll(users, onlineThreshold);
  };

  // Heartbeat: update caller's last-seen timestamp.
  public func heartbeat(
    users : UserList,
    caller : UserTypes.UserId,
    now : UserTypes.Timestamp,
  ) : () {
    switch (UserLib.findById(users, caller)) {
      case null {};
      case (?user) { UserLib.heartbeat(user, now) };
    };
  };

  // Set a username visual effect. Any user can set their own effect.
  // Owners/Admins can set effects on other users by targetUsername.
  public func setUsernameEffect(
    users : UserList,
    caller : UserTypes.UserId,
    targetUsername : Text,
    effect : UserTypes.UsernameEffect,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Caller not registered") };
      case (?callerUser) {
        if (callerUser.username == targetUsername) {
          callerUser.usernameEffect := effect;
          return #ok;
        };
        if (not UserLib.isPrivileged(callerUser)) {
          return #err("You can only set your own username effect");
        };
        switch (UserLib.findByUsername(users, targetUsername)) {
          case null { #err("Target user not found") };
          case (?target) {
            target.usernameEffect := effect;
            #ok;
          };
        };
      };
    };
  };

  // Set text plate. Owner/Admin can set for any user; users can only set their own.
  public func setTextPlate(
    users : UserList,
    caller : UserTypes.UserId,
    targetUsername : Text,
    plate : UserTypes.TextPlate,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Caller not registered") };
      case (?callerUser) {
        let isSelf = callerUser.username == targetUsername;
        if (not isSelf and not UserLib.isPrivileged(callerUser)) {
          return #err("Only Owners and Admins can set text plates for others");
        };
        switch (UserLib.findByUsername(users, targetUsername)) {
          case null { #err("Target user not found") };
          case (?target) {
            target.textPlate := plate;
            #ok;
          };
        };
      };
    };
  };

  // Owner can promote/demote user roles. Only Owner can set Admin. Only Owner can set Owner.
  public func setUserRole(
    users : UserList,
    caller : UserTypes.UserId,
    targetUsername : Text,
    role : UserTypes.Role,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Caller not registered") };
      case (?callerUser) {
        switch (callerUser.role) {
          case (#Owner) {};
          case (_) { return #err("Only the Owner can change user roles") };
        };
        switch (UserLib.findByUsername(users, targetUsername)) {
          case null { #err("Target user not found") };
          case (?target) {
            // Prevent stripping Owner from Mr.Romaniaman
            if (target.username == "Mr.Romaniaman") {
              return #err("Cannot change Mr.Romaniaman's role");
            };
            target.role := role;
            #ok;
          };
        };
      };
    };
  };
};
