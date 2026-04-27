import { useState } from "react";
import type { TextPlate, User, UsernameEffect } from "../types";

type ProfileUpdates = Partial<
  Pick<
    User,
    | "bio"
    | "avatarUrl"
    | "username"
    | "usernameEffect"
    | "textPlate"
    | "biography"
  >
>;

interface Props {
  user: User;
  onUpdateProfile: (updates: ProfileUpdates) => void;
}

const EFFECT_LABELS: Record<UsernameEffect, string> = {
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
  Shadow: "🌑 Shadow",
};

const TEXT_PLATE_LABELS: Record<TextPlate, string> = {
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
  LavaPlate: "🌋 Lava",
};

const WIN95_INPUT: React.CSSProperties = {
  fontFamily: "Tahoma, Verdana, sans-serif",
  fontSize: 11,
  border: "2px solid",
  borderColor: "#808080 #fff #fff #808080",
  background: "#fff",
  padding: "2px 4px",
  boxSizing: "border-box",
};

export function MyComputer({ user, onUpdateProfile }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(user.bio || "");
  const [biography, setBiography] = useState(user.biography || "");
  const [effect, setEffect] = useState<UsernameEffect>(
    user.usernameEffect || "None",
  );
  const [plate, setPlate] = useState<TextPlate>(user.textPlate || "None");
  const canSetTextPlate = user.role === "Owner" || user.role === "Admin";

  return (
    <div
      style={{
        padding: 12,
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: 11,
      }}
    >
      {/* System info */}
      <div
        style={{
          background: "#c0c0c0",
          border: "2px solid",
          borderColor: "#808080 #fff #fff #808080",
          padding: 8,
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "#000",
              border: "2px solid",
              borderColor: "#808080 #fff #fff #808080",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/assets/onyx-logo.png"
              alt="Onyx OS 95"
              width={56}
              height={56}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ lineHeight: 1.8 }}>
            <div>
              <strong>System:</strong> Onyx OS 95 v1.0
            </div>
            <div>
              <strong>Registered to:</strong> {user.username}
            </div>
            <div>
              <strong>Role:</strong>{" "}
              <span
                style={{
                  color:
                    user.role === "Owner"
                      ? "#996600"
                      : user.role === "Admin"
                        ? "#000080"
                        : "#000",
                }}
              >
                {user.role}
              </span>
            </div>
            <div>
              <strong>Computer:</strong> Compaq Presario 700
            </div>
            <div>
              <strong>Processor:</strong> Intel 486
            </div>
            <div>
              <strong>Memory:</strong> 8 MB RAM
            </div>
          </div>
        </div>
      </div>

      {/* Profile section */}
      <div
        style={{
          fontWeight: "bold",
          marginBottom: 6,
          borderBottom: "1px solid #808080",
          paddingBottom: 3,
        }}
      >
        User Profile
      </div>

      {editMode ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 8,
          }}
        >
          {/* Bio (short) */}
          <div>
            <label
              htmlFor="mc-bio"
              style={{ display: "block", marginBottom: 2 }}
            >
              Short Bio:
            </label>
            <input
              id="mc-bio"
              data-ocid="mycomputer.bio_input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ ...WIN95_INPUT, width: "100%" }}
            />
          </div>
          {/* Biography (long) */}
          <div>
            <label
              htmlFor="mc-biography"
              style={{ display: "block", marginBottom: 2 }}
            >
              Biography:
            </label>
            <textarea
              id="mc-biography"
              data-ocid="mycomputer.biography_input"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              rows={3}
              style={{ ...WIN95_INPUT, width: "100%", resize: "vertical" }}
            />
          </div>
          {/* Username effect */}
          <div>
            <label
              htmlFor="mc-effect"
              style={{ display: "block", marginBottom: 2 }}
            >
              Username Effect:
            </label>
            <select
              id="mc-effect"
              data-ocid="mycomputer.effect_select"
              value={effect}
              onChange={(e) => setEffect(e.target.value as UsernameEffect)}
              style={{ ...WIN95_INPUT, width: "100%" }}
            >
              {(Object.keys(EFFECT_LABELS) as UsernameEffect[]).map((k) => (
                <option key={k} value={k}>
                  {EFFECT_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
          {/* Text plate — owners and admins only */}
          {canSetTextPlate && (
            <div>
              <label
                htmlFor="mc-plate"
                style={{ display: "block", marginBottom: 2 }}
              >
                Chat Text Plate (Owner/Admin only):
              </label>
              <select
                id="mc-plate"
                data-ocid="mycomputer.textplate_select"
                value={plate}
                onChange={(e) => setPlate(e.target.value as TextPlate)}
                style={{ ...WIN95_INPUT, width: "100%" }}
              >
                {(Object.keys(TEXT_PLATE_LABELS) as TextPlate[]).map((k) => (
                  <option key={k} value={k}>
                    {TEXT_PLATE_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div>
            <strong>Short Bio:</strong>{" "}
            <span style={{ color: bio ? "#000" : "#888" }}>
              {bio || "(none)"}
            </span>
          </div>
          <div>
            <strong>Biography:</strong>
            <div
              style={{
                ...WIN95_INPUT,
                minHeight: 36,
                marginTop: 2,
                color: biography ? "#000" : "#888",
              }}
            >
              {biography || "(no biography set)"}
            </div>
          </div>
          <div>
            <strong>Username Effect:</strong>{" "}
            {EFFECT_LABELS[user.usernameEffect || "None"]}
          </div>
          {canSetTextPlate && (
            <div>
              <strong>Text Plate:</strong>{" "}
              {TEXT_PLATE_LABELS[user.textPlate || "None"]}
            </div>
          )}
          <div>
            <strong>Status:</strong>{" "}
            <span style={{ color: user.isOnline ? "#008000" : "#800" }}>
              {user.isOnline ? "● Online" : "○ Offline"}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 6 }}>
        {editMode ? (
          <>
            <button
              type="button"
              data-ocid="mycomputer.save_button"
              className="btn-95"
              onClick={() => {
                const updates: ProfileUpdates = {
                  bio,
                  biography,
                  usernameEffect: effect,
                };
                if (canSetTextPlate) updates.textPlate = plate;
                onUpdateProfile(updates);
                setEditMode(false);
              }}
            >
              Save
            </button>
            <button
              type="button"
              data-ocid="mycomputer.cancel_button"
              className="btn-95"
              onClick={() => {
                setBio(user.bio || "");
                setBiography(user.biography || "");
                setEffect(user.usernameEffect || "None");
                setPlate(user.textPlate || "None");
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            data-ocid="mycomputer.edit_button"
            className="btn-95"
            onClick={() => setEditMode(true)}
          >
            Edit Profile...
          </button>
        )}
      </div>
    </div>
  );
}
