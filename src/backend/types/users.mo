import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  // Role variants
  public type Role = { #Owner; #Admin; #User };

  // Visual effect type for usernames
  public type UsernameEffect = {
    #None;
    #Rainbow;
    #MatrixGreen;
    #MatrixRed;
    #MatrixBlue;
    #Neon;
    #Fire;
    #Ice;
    #Glitch;
    #Gold;
    #Cyberpunk;
    #Shadow;
  };

  // Text plate type for chat messages
  public type TextPlate = {
    #None;
    #MatrixGreen;
    #MatrixRed;
    #MatrixBlue;
    #MatrixYellow;
    #MatrixPurple;
    #MatrixPink;
    #Galaxy;
    #Rainbow;
    #Neon;
    #FirePlate;
    #AuroraPlate;
    #ScanlinesPlate;
    #ElectricPlate;
    #LavaPlate;
  };

  // Internal user record (with mutable fields)
  public type UserInternal = {
    id : UserId;
    var username : Text;
    var passwordHash : Text;
    var role : Role;
    var bio : Text;
    var biography : Text;
    var avatarUrl : Text;
    var usernameEffect : UsernameEffect;
    var textPlate : TextPlate;
    var lastSeen : Timestamp;
  };

  // Public user record (shareable, no mutable fields)
  public type User = {
    id : UserId;
    username : Text;
    role : Role;
    bio : Text;
    biography : Text;
    avatarUrl : Text;
    usernameEffect : UsernameEffect;
    textPlate : TextPlate;
    lastSeen : Timestamp;
    isOnline : Bool;
  };

  // Profile update payload
  public type ProfileUpdate = {
    username : Text;
    bio : Text;
    biography : Text;
    avatarUrl : Text;
    usernameEffect : UsernameEffect;
    textPlate : ?TextPlate; // optional: only Owner/Admin can set textPlate for others; null = no change
  };

  // Register/login result
  public type AuthResult = { #ok : User; #err : Text };
};
