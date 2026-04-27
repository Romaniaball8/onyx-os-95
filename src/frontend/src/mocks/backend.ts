import type { backendInterface, User, Note, ChatMessage, Mail } from "../backend";
import { Role, UsernameEffect, TextPlate } from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const mockPrincipal = Principal.fromText("2vxsx-fae");
const mockPrincipal2 = Principal.fromText("aaaaa-aa");

const mockUser: User = {
  id: mockPrincipal,
  bio: "Welcome to Onyx OS 95!",
  biography: "Welcome to Onyx OS 95!",
  username: "Administrator",
  role: Role.Owner,
  isOnline: true,
  usernameEffect: UsernameEffect.None,
  textPlate: TextPlate.None,
  avatarUrl: "",
  lastSeen: BigInt(Date.now()) * BigInt(1_000_000),
};

const mockUser2: User = {
  id: mockPrincipal2,
  bio: "Regular user",
  biography: "Regular user",
  username: "JohnDoe",
  role: Role.User,
  isOnline: false,
  usernameEffect: UsernameEffect.Rainbow,
  textPlate: TextPlate.None,
  avatarUrl: "",
  lastSeen: BigInt(Date.now() - 300_000) * BigInt(1_000_000),
};

const mockNote: Note = {
  id: BigInt(1),
  title: "Welcome Note",
  ownerId: mockPrincipal,
  body: "Welcome to Onyx OS 95! This is a sample note.",
  createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
};

const mockMessage: ChatMessage = {
  id: BigInt(1),
  body: "Hello from Onyx OS 95!",
  senderUsername: "Administrator",
  sender: mockPrincipal,
  timestamp: BigInt(Date.now()) * BigInt(1_000_000),
};

const mockMail: Mail = {
  id: BigInt(1),
  subject: "Welcome to Onyx OS 95",
  body: "Thank you for joining Onyx OS 95. Enjoy your stay!",
  senderUsername: "Administrator",
  isRead: false,
  sender: mockPrincipal,
  sentAt: BigInt(Date.now()) * BigInt(1_000_000),
  recipientUsername: "JohnDoe",
};

export const mockBackend: backendInterface = {
  acceptFriendRequest: async (_fromUsername) => ({ __kind__: "ok", ok: null }),
  createNote: async (_input) => ({
    __kind__: "ok",
    ok: mockNote,
  }),
  deleteNote: async (_id) => ({ __kind__: "ok", ok: null }),
  getFriendRequests: async () => [],
  getFriends: async () => [],
  getInbox: async () => [mockMail],
  getMessages: async (_limit) => [mockMessage],
  getNote: async (_id) => mockNote,
  getNotes: async () => [mockNote],
  getPrivateMessages: async (_withUsername) => [],
  getProfile: async (_id) => mockUser,
  getSent: async () => [mockMail],
  listUsers: async () => [mockUser, mockUser2],
  login: async (_passwordHash) => ({ __kind__: "ok", ok: mockUser }),
  markPrivateMessageRead: async (_id) => ({ __kind__: "ok", ok: null }),
  markRead: async (_id) => ({ __kind__: "ok", ok: null }),
  ping: async () => undefined,
  register: async (_username, _passwordHash) => ({ __kind__: "ok", ok: mockUser }),
  rejectFriendRequest: async (_fromUsername) => ({ __kind__: "ok", ok: null }),
  sendFriendRequest: async (_toUsername) => ({ __kind__: "ok", ok: null }),
  sendMail: async (_input) => ({ __kind__: "ok", ok: mockMail }),
  sendMessage: async (_body) => ({ __kind__: "ok", ok: mockMessage }),
  sendPrivateMessage: async (_toUsername, _body) => ({ __kind__: "ok", ok: null }),
  setTextPlate: async (_targetUsername, _plate) => ({ __kind__: "ok", ok: null }),
  setUserRole: async (_targetUsername, _role) => ({ __kind__: "ok", ok: null }),
  setUsernameEffect: async (_targetUsername, _effect) => ({ __kind__: "ok", ok: null }),
  updateNote: async (_id, _input) => ({ __kind__: "ok", ok: mockNote }),
  updateProfile: async (_update) => ({ __kind__: "ok", ok: mockUser }),
};
