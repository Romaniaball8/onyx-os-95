import { useEffect, useRef, useState } from "react";
import type { AuthState } from "../types";

interface Props {
  onLogin: (username: string, password: string) => boolean;
  onRegister: (username: string, password: string) => boolean;
  error: AuthState["error"];
  onClearError: () => void;
}

export function LoginScreen({
  onLogin,
  onRegister,
  error,
  onClearError,
}: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input whenever tab changes (tab used as trigger only)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional tab-change focus
  useEffect(() => {
    firstInputRef.current?.focus();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = () => {
    onClearError();
    setLocalError(null);
    if (!username.trim() || !password) {
      setLocalError("Please enter a username and password.");
      return;
    }
    onLogin(username.trim(), password);
  };

  const handleRegister = () => {
    onClearError();
    setLocalError(null);
    if (!username.trim() || !password) {
      setLocalError("Please enter a username and password.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    onRegister(username.trim(), password);
  };

  const displayError = localError || error;

  return (
    <div
      data-ocid="login.screen"
      style={{
        position: "fixed",
        inset: 0,
        background: "#008080",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Tahoma, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "#c0c0c0",
          border: "2px solid",
          borderColor: "#ffffff #808080 #808080 #ffffff",
          boxShadow: "2px 2px 0 #000",
          width: 340,
          minHeight: 220,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "linear-gradient(90deg, #000080, #1084d0)",
            color: "#fff",
            padding: "3px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 11,
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          <span>Onyx OS 95 — Welcome</span>
          <div style={{ display: "flex", gap: 1 }}>
            {["_", "□", "✕"].map((sym) => (
              <div
                key={sym}
                style={{
                  width: 16,
                  height: 14,
                  background: "#c0c0c0",
                  color: "#000",
                  border: "1px solid",
                  borderColor: "#fff #808080 #808080 #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: "bold",
                  cursor: "default",
                }}
                aria-hidden="true"
              >
                {sym}
              </div>
            ))}
          </div>
        </div>

        {/* Tab strip */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #808080",
            background: "#c0c0c0",
          }}
        >
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              type="button"
              data-ocid={`login.${t}_tab`}
              onClick={() => {
                setTab(t);
                setLocalError(null);
                onClearError();
              }}
              style={{
                padding: "4px 14px",
                fontSize: 11,
                border: "none",
                borderBottom: tab === t ? "2px solid #c0c0c0" : "none",
                borderTop: tab === t ? "2px solid #fff" : "none",
                borderLeft: tab === t ? "2px solid #fff" : "none",
                borderRight: tab === t ? "2px solid #808080" : "none",
                background: tab === t ? "#c0c0c0" : "#b0b0b0",
                cursor: "pointer",
                fontFamily: "Tahoma, Verdana, sans-serif",
                fontWeight: tab === t ? "bold" : "normal",
                position: "relative",
                zIndex: tab === t ? 1 : 0,
                marginBottom: tab === t ? -1 : 0,
              }}
            >
              {t === "login" ? "Log On" : "Register"}
            </button>
          ))}
        </div>

        {/* Form body */}
        <div style={{ padding: "16px 16px 12px" }}>
          <div style={{ marginBottom: 10 }}>
            <label
              htmlFor="login-username"
              style={{ fontSize: 11, display: "block", marginBottom: 3 }}
            >
              User name:
            </label>
            <input
              id="login-username"
              ref={firstInputRef}
              data-ocid="login.username_input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (tab === "login" ? handleLogin() : handleRegister())
              }
              className="text-input-95"
              style={{ width: "100%", boxSizing: "border-box" }}
              maxLength={24}
            />
          </div>
          <div style={{ marginBottom: tab === "register" ? 10 : 14 }}>
            <label
              htmlFor="login-password"
              style={{ fontSize: 11, display: "block", marginBottom: 3 }}
            >
              Password:
            </label>
            <input
              id="login-password"
              data-ocid="login.password_input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (tab === "login" ? handleLogin() : handleRegister())
              }
              className="text-input-95"
              style={{ width: "100%", boxSizing: "border-box" }}
              maxLength={64}
            />
          </div>
          {tab === "register" && (
            <div style={{ marginBottom: 14 }}>
              <label
                htmlFor="login-confirm"
                style={{ fontSize: 11, display: "block", marginBottom: 3 }}
              >
                Confirm Password:
              </label>
              <input
                id="login-confirm"
                data-ocid="login.confirm_input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                className="text-input-95"
                style={{ width: "100%", boxSizing: "border-box" }}
                maxLength={64}
              />
            </div>
          )}

          {displayError && (
            <div
              data-ocid="login.error_state"
              style={{
                background: "#fff0f0",
                border: "1px solid #c00",
                padding: "4px 6px",
                fontSize: 11,
                color: "#800",
                marginBottom: 10,
              }}
            >
              {displayError}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button
              type="button"
              data-ocid="login.submit_button"
              className="btn-95"
              onClick={tab === "login" ? handleLogin : handleRegister}
              style={{ minWidth: 75 }}
            >
              {tab === "login" ? "OK" : "Register"}
            </button>
            <button
              type="button"
              data-ocid="login.cancel_button"
              className="btn-95"
              onClick={() => {
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setLocalError(null);
                onClearError();
              }}
              style={{ minWidth: 75 }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="statusbar-95">
          <div
            className="statusbar-item"
            style={{ fontSize: 10, color: "#444" }}
          >
            {tab === "login"
              ? "Enter your username and password to log on."
              : "Create a new Onyx OS 95 account."}
          </div>
        </div>
      </div>
    </div>
  );
}
