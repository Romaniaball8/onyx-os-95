import Common "common";

module {
  public type NoteId = Common.NoteId;
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  // Internal note record
  public type NoteInternal = {
    id : NoteId;
    ownerId : UserId;
    var title : Text;
    var body : Text;
    createdAt : Timestamp;
    var updatedAt : Timestamp;
  };

  // Public note record (shareable)
  public type Note = {
    id : NoteId;
    ownerId : UserId;
    title : Text;
    body : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  // Input for creating or updating a note
  public type NoteInput = {
    title : Text;
    body : Text;
  };

  public type NoteResult = { #ok : Note; #err : Text };
};
