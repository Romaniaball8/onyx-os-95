import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  // ── Old types (must include ALL variants ever deployed to the live canister)
  // OldUsernameEffect: includes the original 6 variants PLUS the expanded set
  // added in the prior build (Fire, Ice, Glitch, Gold, Cyberpunk, Shadow).
  // Any variant present in live state but absent here triggers M0170.

  type OldUsernameEffect = {
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

  // OldTextPlate: includes the original 10 variants PLUS the 5 new variants
  // added in the prior build (FirePlate, AuroraPlate, ScanlinesPlate,
  // ElectricPlate, LavaPlate).  All of these may exist in live canister state.
  type OldTextPlate = {
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

  type OldUserInternal = {
    id : Principal;
    var username : Text;
    var passwordHash : Text;
    var role : { #Owner; #Admin; #User };
    var bio : Text;
    var biography : Text;
    var avatarUrl : Text;
    var usernameEffect : OldUsernameEffect;
    var textPlate : OldTextPlate;
    var lastSeen : Int;
  };

  type OldList<T> = List.List<T>;

  // ── New types (mirrors current types/users.mo) ────────────────────────────

  type NewUsernameEffect = {
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

  type NewTextPlate = {
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

  type NewUserInternal = {
    id : Principal;
    var username : Text;
    var passwordHash : Text;
    var role : { #Owner; #Admin; #User };
    var bio : Text;
    var biography : Text;
    var avatarUrl : Text;
    var usernameEffect : NewUsernameEffect;
    var textPlate : NewTextPlate;
    var lastSeen : Int;
  };

  // ── Migration helpers ─────────────────────────────────────────────────────

  // OldUsernameEffect and NewUsernameEffect are identical variant sets —
  // cast directly via exhaustive switch so the compiler verifies completeness.
  func migrateUsernameEffect(old : OldUsernameEffect) : NewUsernameEffect {
    switch old {
      case (#None) #None;
      case (#Rainbow) #Rainbow;
      case (#MatrixGreen) #MatrixGreen;
      case (#MatrixRed) #MatrixRed;
      case (#MatrixBlue) #MatrixBlue;
      case (#Neon) #Neon;
      case (#Fire) #Fire;
      case (#Ice) #Ice;
      case (#Glitch) #Glitch;
      case (#Gold) #Gold;
      case (#Cyberpunk) #Cyberpunk;
      case (#Shadow) #Shadow;
    };
  };

  // OldTextPlate and NewTextPlate are identical variant sets —
  // cast directly via exhaustive switch.
  func migrateTextPlate(old : OldTextPlate) : NewTextPlate {
    switch old {
      case (#None) #None;
      case (#MatrixGreen) #MatrixGreen;
      case (#MatrixRed) #MatrixRed;
      case (#MatrixBlue) #MatrixBlue;
      case (#MatrixYellow) #MatrixYellow;
      case (#MatrixPurple) #MatrixPurple;
      case (#MatrixPink) #MatrixPink;
      case (#Galaxy) #Galaxy;
      case (#Rainbow) #Rainbow;
      case (#Neon) #Neon;
      case (#FirePlate) #FirePlate;
      case (#AuroraPlate) #AuroraPlate;
      case (#ScanlinesPlate) #ScanlinesPlate;
      case (#ElectricPlate) #ElectricPlate;
      case (#LavaPlate) #LavaPlate;
    };
  };

  func migrateUser(old : OldUserInternal) : NewUserInternal {
    {
      id = old.id;
      var username = old.username;
      var passwordHash = old.passwordHash;
      var role = old.role;
      var bio = old.bio;
      var biography = old.biography;
      var avatarUrl = old.avatarUrl;
      var usernameEffect = migrateUsernameEffect(old.usernameEffect);
      var textPlate = migrateTextPlate(old.textPlate);
      var lastSeen = old.lastSeen;
    };
  };

  // ── Actor state shapes ────────────────────────────────────────────────────

  public type OldActor = {
    users : OldList<OldUserInternal>;
  };

  public type NewActor = {
    users : List.List<NewUserInternal>;
  };

  // ── Migration entry point ─────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    {
      users = old.users.map<OldUserInternal, NewUserInternal>(migrateUser);
    };
  };
};
