export type Role = "Owner" | "Admin" | "User";

export type UsernameEffect =
  | "None"
  | "Rainbow"
  | "MatrixGreen"
  | "MatrixRed"
  | "MatrixBlue"
  | "Neon"
  | "Fire"
  | "Ice"
  | "Glitch"
  | "Gold"
  | "Cyberpunk"
  | "Shadow";

export type TextPlate =
  | "None"
  | "MatrixGreen"
  | "MatrixRed"
  | "MatrixBlue"
  | "MatrixYellow"
  | "MatrixPurple"
  | "MatrixPink"
  | "Galaxy"
  | "Rainbow"
  | "Neon"
  | "FirePlate"
  | "AuroraPlate"
  | "ScanlinesPlate"
  | "ElectricPlate"
  | "LavaPlate";

export interface User {
  id: string;
  username: string;
  role: Role;
  bio: string;
  avatarUrl: string;
  usernameEffect: UsernameEffect;
  textPlate: TextPlate;
  biography: string;
  lastSeen: number;
  isOnline: boolean;
}

export type AppId =
  | "my-computer"
  | "network"
  | "game-center"
  | "live-chat"
  | "notes"
  | "paint"
  | "mail"
  | "internet-explorer"
  | "friends";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
