import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Mail {
    id: MailId;
    subject: string;
    body: string;
    senderUsername: string;
    isRead: boolean;
    sender: UserId;
    sentAt: Timestamp;
    recipientUsername: string;
}
export type NoteId = bigint;
export type Timestamp = bigint;
export interface ProfileUpdate {
    bio: string;
    username: string;
    biography: string;
    textPlate?: TextPlate;
    usernameEffect: UsernameEffect;
    avatarUrl: string;
}
export type NoteResult = {
    __kind__: "ok";
    ok: Note;
} | {
    __kind__: "err";
    err: string;
};
export interface User {
    id: UserId;
    bio: string;
    username: string;
    role: Role;
    biography: string;
    isOnline: boolean;
    textPlate: TextPlate;
    usernameEffect: UsernameEffect;
    avatarUrl: string;
    lastSeen: Timestamp;
}
export type PrivateMessageId = bigint;
export interface MailInput {
    subject: string;
    body: string;
    recipientUsername: string;
}
export interface PrivateMessage {
    id: PrivateMessageId;
    body: string;
    isRead: boolean;
    toUsername: string;
    timestamp: Timestamp;
    fromUsername: string;
}
export type UserId = Principal;
export interface NoteInput {
    title: string;
    body: string;
}
export type MailId = bigint;
export type MessageId = bigint;
export interface FriendRequest {
    status: FriendRequestStatus;
    toUsername: string;
    timestamp: Timestamp;
    fromUsername: string;
}
export type MailResult = {
    __kind__: "ok";
    ok: Mail;
} | {
    __kind__: "err";
    err: string;
};
export interface ChatMessage {
    id: MessageId;
    body: string;
    senderUsername: string;
    sender: UserId;
    timestamp: Timestamp;
}
export type AuthResult = {
    __kind__: "ok";
    ok: User;
} | {
    __kind__: "err";
    err: string;
};
export interface Note {
    id: NoteId;
    title: string;
    ownerId: UserId;
    body: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export enum FriendRequestStatus {
    Rejected = "Rejected",
    Accepted = "Accepted",
    Pending = "Pending"
}
export enum Role {
    User = "User",
    Admin = "Admin",
    Owner = "Owner"
}
export enum TextPlate {
    Neon = "Neon",
    None = "None",
    MatrixPurple = "MatrixPurple",
    MatrixRed = "MatrixRed",
    ScanlinesPlate = "ScanlinesPlate",
    FirePlate = "FirePlate",
    MatrixBlue = "MatrixBlue",
    MatrixPink = "MatrixPink",
    Galaxy = "Galaxy",
    LavaPlate = "LavaPlate",
    MatrixYellow = "MatrixYellow",
    ElectricPlate = "ElectricPlate",
    Rainbow = "Rainbow",
    MatrixGreen = "MatrixGreen",
    AuroraPlate = "AuroraPlate"
}
export enum UsernameEffect {
    Ice = "Ice",
    Fire = "Fire",
    Gold = "Gold",
    Neon = "Neon",
    None = "None",
    MatrixRed = "MatrixRed",
    Shadow = "Shadow",
    MatrixBlue = "MatrixBlue",
    Cyberpunk = "Cyberpunk",
    Glitch = "Glitch",
    Rainbow = "Rainbow",
    MatrixGreen = "MatrixGreen"
}
export interface backendInterface {
    acceptFriendRequest(fromUsername: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createNote(input: NoteInput): Promise<NoteResult>;
    deleteNote(id: NoteId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getFriendRequests(): Promise<Array<FriendRequest>>;
    getFriends(): Promise<Array<User>>;
    getInbox(): Promise<Array<Mail>>;
    getMessages(limit: bigint): Promise<Array<ChatMessage>>;
    getNote(id: NoteId): Promise<Note | null>;
    getNotes(): Promise<Array<Note>>;
    getPrivateMessages(withUsername: string): Promise<Array<PrivateMessage>>;
    getProfile(id: UserId): Promise<User | null>;
    getSent(): Promise<Array<Mail>>;
    listUsers(): Promise<Array<User>>;
    login(passwordHash: string): Promise<AuthResult>;
    markPrivateMessageRead(id: PrivateMessageId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    markRead(id: MailId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    ping(): Promise<void>;
    register(username: string, passwordHash: string): Promise<AuthResult>;
    rejectFriendRequest(fromUsername: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendFriendRequest(toUsername: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendMail(input: MailInput): Promise<MailResult>;
    sendMessage(body: string): Promise<{
        __kind__: "ok";
        ok: ChatMessage;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendPrivateMessage(toUsername: string, body: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setTextPlate(targetUsername: string, plate: TextPlate): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setUserRole(targetUsername: string, role: Role): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setUsernameEffect(targetUsername: string, effect: UsernameEffect): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateNote(id: NoteId, input: NoteInput): Promise<NoteResult>;
    updateProfile(update: ProfileUpdate): Promise<AuthResult>;
}
