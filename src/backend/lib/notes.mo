import List "mo:core/List";
import Principal "mo:core/Principal";
import Types "../types/notes";

module {
  public type NoteList = List.List<Types.NoteInternal>;

  // Creates a new note (does NOT add to the list)
  public func newNote(
    id : Types.NoteId,
    ownerId : Types.UserId,
    input : Types.NoteInput,
    now : Types.Timestamp,
  ) : Types.NoteInternal {
    {
      id;
      ownerId;
      var title = input.title;
      var body = input.body;
      createdAt = now;
      var updatedAt = now;
    };
  };

  // Converts an internal note to a public shareable record
  public func toPublic(note : Types.NoteInternal) : Types.Note {
    {
      id = note.id;
      ownerId = note.ownerId;
      title = note.title;
      body = note.body;
      createdAt = note.createdAt;
      updatedAt = note.updatedAt;
    };
  };

  // Returns all notes belonging to a specific user
  public func forUser(notes : NoteList, ownerId : Types.UserId) : [Types.Note] {
    notes
      .filter(func(n) { Principal.equal(n.ownerId, ownerId) })
      .map<Types.NoteInternal, Types.Note>(func(n) { toPublic(n) })
      .toArray();
  };

  // Finds a note by id and owner (returns null if not found or wrong owner)
  public func findOwned(notes : NoteList, id : Types.NoteId, ownerId : Types.UserId) : ?Types.NoteInternal {
    notes.find(func(n) { n.id == id and Principal.equal(n.ownerId, ownerId) });
  };

  // Updates mutable fields of a note in-place
  public func update(note : Types.NoteInternal, input : Types.NoteInput, now : Types.Timestamp) {
    note.title := input.title;
    note.body := input.body;
    note.updatedAt := now;
  };

  // Removes a note from the list (by id and owner). Returns true if found and removed.
  public func deleteOwned(notes : NoteList, id : Types.NoteId, ownerId : Types.UserId) : Bool {
    let sizeBefore = notes.size();
    let filtered = notes.filter(func(n) { not (n.id == id and Principal.equal(n.ownerId, ownerId)) });
    let sizeAfter = filtered.size();
    // Mutate the original list by clearing and re-adding filtered items
    notes.clear();
    notes.append(filtered);
    sizeAfter < sizeBefore;
  };
};
