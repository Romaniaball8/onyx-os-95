import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
function NotesApp({ user }) {
  const [notes, setNotes] = reactExports.useState([
    {
      id: "note-1",
      title: "Welcome",
      content: "Welcome to Notes!\n\nType your notes here.",
      updatedAt: Date.now()
    }
  ]);
  const [selectedId, setSelectedId] = reactExports.useState("note-1");
  const [editTitle, setEditTitle] = reactExports.useState("Welcome");
  const [editContent, setEditContent] = reactExports.useState(
    "Welcome to Notes!\n\nType your notes here."
  );
  const [saveStatus, setSaveStatus] = reactExports.useState(
    "idle"
  );
  const debounceRef = reactExports.useRef(null);
  const selectedNote = notes.find((n) => n.id === selectedId);
  reactExports.useEffect(() => {
    if (!selectedId) return;
    setSaveStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setNotes(
        (prev) => prev.map(
          (n) => n.id === selectedId ? {
            ...n,
            title: editTitle,
            content: editContent,
            updatedAt: Date.now()
          } : n
        )
      );
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2e3);
    }, 1e3);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editContent, editTitle, selectedId]);
  const selectNote = (note) => {
    setNotes(
      (prev) => prev.map(
        (n) => n.id === selectedId ? {
          ...n,
          title: editTitle,
          content: editContent,
          updatedAt: Date.now()
        } : n
      )
    );
    setSelectedId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };
  const createNote = () => {
    const id = `note-${Date.now()}`;
    const note = {
      id,
      title: "New Note",
      content: "",
      updatedAt: Date.now()
    };
    setNotes((prev) => [...prev, note]);
    selectNote(note);
  };
  const deleteNote = (id) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        height: "100%",
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              width: 140,
              borderRight: "1px solid #808080",
              display: "flex",
              flexDirection: "column",
              background: "#c0c0c0"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    padding: "4px 4px",
                    borderBottom: "1px solid #808080",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: "bold", fontSize: 10 }, children: [
                      "Notes (",
                      notes.length,
                      ")"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "notes.new_button",
                        className: "btn-95",
                        onClick: createNote,
                        style: { fontSize: 10, padding: "1px 6px" },
                        children: "New"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto" }, children: [
                notes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "data-ocid": "notes.empty_state",
                    style: { padding: 8, color: "#888", fontSize: 10 },
                    children: "No notes yet."
                  }
                ),
                notes.map((note, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `notes.item.${i + 1}`,
                    style: {
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
                      fontSize: 11
                    },
                    onClick: () => selectNote(note),
                    children: note.title || "Untitled"
                  },
                  note.id
                ))
              ] })
            ]
          }
        ),
        selectedNote ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "3px 6px",
                borderBottom: "1px solid #808080",
                display: "flex",
                gap: 4,
                alignItems: "center",
                background: "#c0c0c0"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    "data-ocid": "notes.title_input",
                    type: "text",
                    value: editTitle,
                    onChange: (e) => setEditTitle(e.target.value),
                    className: "text-input-95",
                    style: { flex: 1, boxSizing: "border-box" },
                    placeholder: "Note title..."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "notes.save_button",
                    className: "btn-95",
                    onClick: () => {
                      setNotes(
                        (prev) => prev.map(
                          (n) => n.id === selectedId ? {
                            ...n,
                            title: editTitle,
                            content: editContent,
                            updatedAt: Date.now()
                          } : n
                        )
                      );
                    },
                    children: "Save"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "notes.delete_button",
                    className: "btn-95",
                    onClick: () => deleteNote(selectedId),
                    style: { color: "#800" },
                    children: "Delete"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              "data-ocid": "notes.content_input",
              value: editContent,
              onChange: (e) => setEditContent(e.target.value),
              style: {
                flex: 1,
                resize: "none",
                border: "none",
                outline: "none",
                padding: 8,
                fontFamily: "Times New Roman, Georgia, serif",
                fontSize: 13,
                lineHeight: 1.6,
                background: "#fff",
                color: "#000"
              },
              placeholder: "Start typing..."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "2px 6px",
                borderTop: "1px solid #808080",
                fontSize: 10,
                color: "#555",
                background: "#c0c0c0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  user.username,
                  " — Last saved:",
                  " ",
                  new Date(selectedNote.updatedAt).toLocaleTimeString()
                ] }),
                saveStatus !== "idle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    "data-ocid": "notes.save_status",
                    style: {
                      color: saveStatus === "saving" ? "#808080" : "#008000",
                      fontStyle: "italic"
                    },
                    children: saveStatus === "saving" ? "Saving..." : "Saved ✓"
                  }
                )
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "notes.empty_state",
            style: {
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888"
            },
            children: "Select a note or create a new one."
          }
        )
      ]
    }
  );
}
export {
  NotesApp
};
