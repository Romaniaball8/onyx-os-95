import { useEffect, useRef, useState } from "react";
import type { User } from "../types";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

interface Props {
  user: User;
}

export function NotesApp({ user }: Props) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note-1",
      title: "Welcome",
      content: "Welcome to Notes!\n\nType your notes here.",
      updatedAt: Date.now(),
    },
  ]);
  const [selectedId, setSelectedId] = useState<string>("note-1");
  const [editTitle, setEditTitle] = useState("Welcome");
  const [editContent, setEditContent] = useState(
    "Welcome to Notes!\n\nType your notes here.",
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedId);

  // Debounced auto-save whenever editContent or editTitle changes
  useEffect(() => {
    if (!selectedId) return;
    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedId
            ? {
                ...n,
                title: editTitle,
                content: editContent,
                updatedAt: Date.now(),
              }
            : n,
        ),
      );
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editContent, editTitle, selectedId]);

  const selectNote = (note: Note) => {
    // Save current before switching
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId
          ? {
              ...n,
              title: editTitle,
              content: editContent,
              updatedAt: Date.now(),
            }
          : n,
      ),
    );
    setSelectedId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const createNote = () => {
    const id = `note-${Date.now()}`;
    const note: Note = {
      id,
      title: "New Note",
      content: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [...prev, note]);
    selectNote(note);
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (remaining.length > 0) {
      const first = remaining[0];
      setSelectedId(first.id);
      setEditTitle(first.title);
      setEditContent(first.content);
    } else {
      setSelectedId("");
      setEditTitle("");
      setEditContent("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11,
      }}
    >
      {/* Note list */}
      <div
        style={{
          width: 140,
          borderRight: "1px solid #808080",
          display: "flex",
          flexDirection: "column",
          background: "#c0c0c0",
        }}
      >
        <div
          style={{
            padding: "4px 4px",
            borderBottom: "1px solid #808080",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: 10 }}>
            Notes ({notes.length})
          </span>
          <button
            type="button"
            data-ocid="notes.new_button"
            className="btn-95"
            onClick={createNote}
            style={{ fontSize: 10, padding: "1px 6px" }}
          >
            New
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {notes.length === 0 && (
            <div
              data-ocid="notes.empty_state"
              style={{ padding: 8, color: "#888", fontSize: 10 }}
            >
              No notes yet.
            </div>
          )}
          {notes.map((note, i) => (
            <button
              key={note.id}
              type="button"
              data-ocid={`notes.item.${i + 1}`}
              style={{
                padding: "4px 6px",
                background: selectedId === note.id ? "#000080" : "transparent",
                color: selectedId === note.id ? "#fff" : "#000",
                cursor: "pointer",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: "100%",
                textAlign: "left",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "1px solid #ddd",
                fontFamily: "Tahoma, Verdana, sans-serif",
                fontSize: 11,
              }}
              onClick={() => selectNote(note)}
            >
              {note.title || "Untitled"}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {selectedNote ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "3px 6px",
              borderBottom: "1px solid #808080",
              display: "flex",
              gap: 4,
              alignItems: "center",
              background: "#c0c0c0",
            }}
          >
            <input
              data-ocid="notes.title_input"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-input-95"
              style={{ flex: 1, boxSizing: "border-box" }}
              placeholder="Note title..."
            />
            <button
              type="button"
              data-ocid="notes.save_button"
              className="btn-95"
              onClick={() => {
                setNotes((prev) =>
                  prev.map((n) =>
                    n.id === selectedId
                      ? {
                          ...n,
                          title: editTitle,
                          content: editContent,
                          updatedAt: Date.now(),
                        }
                      : n,
                  ),
                );
              }}
            >
              Save
            </button>
            <button
              type="button"
              data-ocid="notes.delete_button"
              className="btn-95"
              onClick={() => deleteNote(selectedId)}
              style={{ color: "#800" }}
            >
              Delete
            </button>
          </div>
          <textarea
            data-ocid="notes.content_input"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              padding: 8,
              fontFamily: "Times New Roman, Georgia, serif",
              fontSize: 13,
              lineHeight: 1.6,
              background: "#fff",
              color: "#000",
            }}
            placeholder="Start typing..."
          />
          <div
            style={{
              padding: "2px 6px",
              borderTop: "1px solid #808080",
              fontSize: 10,
              color: "#555",
              background: "#c0c0c0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              {user.username} — Last saved:{" "}
              {new Date(selectedNote.updatedAt).toLocaleTimeString()}
            </span>
            {saveStatus !== "idle" && (
              <span
                data-ocid="notes.save_status"
                style={{
                  color: saveStatus === "saving" ? "#808080" : "#008000",
                  fontStyle: "italic",
                }}
              >
                {saveStatus === "saving" ? "Saving..." : "Saved ✓"}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div
          data-ocid="notes.empty_state"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          Select a note or create a new one.
        </div>
      )}
    </div>
  );
}
