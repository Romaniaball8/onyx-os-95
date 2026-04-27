import { useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { Desktop } from "./components/Desktop";
import { LoginScreen } from "./components/LoginScreen";
import { useAuth } from "./hooks/useAuth";
import { useWindowManager } from "./hooks/useWindowManager";

export default function App() {
  const [bootDone, setBootDone] = useState(false);
  const {
    user,
    login,
    register,
    logout,
    error,
    clearError,
    userStore,
    updateProfile,
  } = useAuth();
  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
  } = useWindowManager();

  if (!bootDone) {
    return <BootScreen onComplete={() => setBootDone(true)} />;
  }

  if (!user) {
    return (
      <LoginScreen
        onLogin={login}
        onRegister={register}
        error={error}
        onClearError={clearError}
      />
    );
  }

  return (
    <Desktop
      user={user}
      windows={windows}
      onOpenApp={openWindow}
      onCloseWindow={closeWindow}
      onMinimizeWindow={minimizeWindow}
      onMaximizeWindow={maximizeWindow}
      onFocusWindow={focusWindow}
      onMoveWindow={moveWindow}
      onLogout={logout}
      userStore={userStore}
      onUpdateProfile={updateProfile}
    />
  );
}
