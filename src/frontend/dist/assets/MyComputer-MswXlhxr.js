import { r as reactExports, j as jsxRuntimeExports } from "./index-D7X0lYXV.js";
const EFFECT_LABELS = {
  None: "None",
  Rainbow: "Rainbow",
  MatrixGreen: "Matrix (Green)",
  MatrixRed: "Matrix (Red)",
  MatrixBlue: "Matrix (Blue)",
  Neon: "Neon",
  Fire: "🔥 Fire",
  Ice: "❄️ Ice",
  Glitch: "⚡ Glitch",
  Gold: "✨ Gold",
  Cyberpunk: "🌆 Cyberpunk",
  Shadow: "🌑 Shadow"
};
const TEXT_PLATE_LABELS = {
  None: "None",
  MatrixGreen: "Matrix (Green)",
  MatrixRed: "Matrix (Red)",
  MatrixBlue: "Matrix (Blue)",
  MatrixYellow: "Matrix (Yellow)",
  MatrixPurple: "Matrix (Purple)",
  MatrixPink: "Matrix (Pink)",
  Galaxy: "Galaxy",
  Rainbow: "Rainbow",
  Neon: "Neon",
  FirePlate: "🔥 Fire",
  AuroraPlate: "🌌 Aurora",
  ScanlinesPlate: "📺 Scanlines",
  ElectricPlate: "⚡ Electric",
  LavaPlate: "🌋 Lava"
};
const WIN95_INPUT = {
  fontFamily: "Tahoma, Verdana, sans-serif",
  fontSize: 11,
  border: "2px solid",
  borderColor: "#808080 #fff #fff #808080",
  background: "#fff",
  padding: "2px 4px",
  boxSizing: "border-box"
};
function MyComputer({ user, onUpdateProfile }) {
  const [editMode, setEditMode] = reactExports.useState(false);
  const [bio, setBio] = reactExports.useState(user.bio || "");
  const [biography, setBiography] = reactExports.useState(user.biography || "");
  const [effect, setEffect] = reactExports.useState(
    user.usernameEffect || "None"
  );
  const [plate, setPlate] = reactExports.useState(user.textPlate || "None");
  const canSetTextPlate = user.role === "Owner" || user.role === "Admin";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        padding: 12,
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#808080 #fff #fff #808080",
              padding: 8,
              marginBottom: 10
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: 64,
                    height: 64,
                    background: "#000",
                    border: "2px solid",
                    borderColor: "#808080 #fff #fff #808080",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: "/assets/onyx-logo.png",
                      alt: "Onyx OS 95",
                      width: 56,
                      height: 56,
                      style: { objectFit: "contain" }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { lineHeight: 1.8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "System:" }),
                  " Onyx OS 95 v1.0"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Registered to:" }),
                  " ",
                  user.username
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Role:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        color: user.role === "Owner" ? "#996600" : user.role === "Admin" ? "#000080" : "#000"
                      },
                      children: user.role
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Computer:" }),
                  " Compaq Presario 700"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Processor:" }),
                  " Intel 486"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Memory:" }),
                  " 8 MB RAM"
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              fontWeight: "bold",
              marginBottom: 6,
              borderBottom: "1px solid #808080",
              paddingBottom: 3
            },
            children: "User Profile"
          }
        ),
        editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 8
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "mc-bio",
                    style: { display: "block", marginBottom: 2 },
                    children: "Short Bio:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "mc-bio",
                    "data-ocid": "mycomputer.bio_input",
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                    style: { ...WIN95_INPUT, width: "100%" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "mc-biography",
                    style: { display: "block", marginBottom: 2 },
                    children: "Biography:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "mc-biography",
                    "data-ocid": "mycomputer.biography_input",
                    value: biography,
                    onChange: (e) => setBiography(e.target.value),
                    rows: 3,
                    style: { ...WIN95_INPUT, width: "100%", resize: "vertical" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "mc-effect",
                    style: { display: "block", marginBottom: 2 },
                    children: "Username Effect:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "mc-effect",
                    "data-ocid": "mycomputer.effect_select",
                    value: effect,
                    onChange: (e) => setEffect(e.target.value),
                    style: { ...WIN95_INPUT, width: "100%" },
                    children: Object.keys(EFFECT_LABELS).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: k, children: EFFECT_LABELS[k] }, k))
                  }
                )
              ] }),
              canSetTextPlate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "mc-plate",
                    style: { display: "block", marginBottom: 2 },
                    children: "Chat Text Plate (Owner/Admin only):"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "mc-plate",
                    "data-ocid": "mycomputer.textplate_select",
                    value: plate,
                    onChange: (e) => setPlate(e.target.value),
                    style: { ...WIN95_INPUT, width: "100%" },
                    children: Object.keys(TEXT_PLATE_LABELS).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: k, children: TEXT_PLATE_LABELS[k] }, k))
                  }
                )
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              marginBottom: 8,
              display: "flex",
              flexDirection: "column",
              gap: 4
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Short Bio:" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: bio ? "#000" : "#888" }, children: bio || "(none)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Biography:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      ...WIN95_INPUT,
                      minHeight: 36,
                      marginTop: 2,
                      color: biography ? "#000" : "#888"
                    },
                    children: biography || "(no biography set)"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Username Effect:" }),
                " ",
                EFFECT_LABELS[user.usernameEffect || "None"]
              ] }),
              canSetTextPlate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Text Plate:" }),
                " ",
                TEXT_PLATE_LABELS[user.textPlate || "None"]
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Status:" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: user.isOnline ? "#008000" : "#800" }, children: user.isOnline ? "● Online" : "○ Offline" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6 }, children: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "mycomputer.save_button",
              className: "btn-95",
              onClick: () => {
                const updates = {
                  bio,
                  biography,
                  usernameEffect: effect
                };
                if (canSetTextPlate) updates.textPlate = plate;
                onUpdateProfile(updates);
                setEditMode(false);
              },
              children: "Save"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "mycomputer.cancel_button",
              className: "btn-95",
              onClick: () => {
                setBio(user.bio || "");
                setBiography(user.biography || "");
                setEffect(user.usernameEffect || "None");
                setPlate(user.textPlate || "None");
                setEditMode(false);
              },
              children: "Cancel"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "mycomputer.edit_button",
            className: "btn-95",
            onClick: () => setEditMode(true),
            children: "Edit Profile..."
          }
        ) })
      ]
    }
  );
}
export {
  MyComputer
};
