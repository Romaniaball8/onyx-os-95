import List "mo:core/List";
import NoteTypes "../types/notes";
import UserTypes "../types/users";
import NoteLib "../lib/notes";

module NotesApi {
  public type NoteList = List.List<NoteTypes.NoteInternal>;
  public type UserList = List.List<UserTypes.UserInternal>;
  public type Counter = { var value : Nat };

  // Create a new note for the caller.
  public func createNote(
    notes : NoteList,
    counter : Counter,
    caller : NoteTypes.UserId,
    input : NoteTypes.NoteInput,
    now : NoteTypes.Timestamp,
  ) : NoteTypes.NoteResult {
    let id = counter.value;
    counter.value += 1;
    let note = NoteLib.newNote(id, caller, input, now);
    notes.add(note);
    #ok(NoteLib.toPublic(note));
  };

  // Get all notes belonging to the caller.
  public func getNotes(
    notes : NoteList,
    caller : NoteTypes.UserId,
  ) : [NoteTypes.Note] {
    NoteLib.forUser(notes, caller);
  };

  // Get a single note by id (caller must be owner).
  public func getNote(
    notes : NoteList,
    caller : NoteTypes.UserId,
    id : NoteTypes.NoteId,
  ) : ?NoteTypes.Note {
    switch (NoteLib.findOwned(notes, id, caller)) {
      case null null;
      case (?note) ?NoteLib.toPublic(note);
    };
  };

  // Update a note (caller must be owner).
  public func updateNote(
    notes : NoteList,
    caller : NoteTypes.UserId,
    id : NoteTypes.NoteId,
    input : NoteTypes.NoteInput,
    now : NoteTypes.Timestamp,
  ) : NoteTypes.NoteResult {
    switch (NoteLib.findOwned(notes, id, caller)) {
      case null { #err("Note not found") };
      case (?note) {
        NoteLib.update(note, input, now);
        #ok(NoteLib.toPublic(note));
      };
    };
  };

  // Delete a note (caller must be owner).
  public func deleteNote(
    notes : NoteList,
    caller : NoteTypes.UserId,
    id : NoteTypes.NoteId,
  ) : { #ok; #err : Text } {
    if (NoteLib.deleteOwned(notes, id, caller)) {
      #ok;
    } else {
      #err("Note not found");
    };
  };
};
