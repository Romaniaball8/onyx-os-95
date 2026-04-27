import List "mo:core/List";
import Time "mo:core/Time";

import UserTypes "types/users";
import NoteTypes "types/notes";
import ChatTypes "types/chat";
import MailTypes "types/mail";
import FriendTypes "types/friends";

import UsersApi "mixins/users-api";
import NotesApi "mixins/notes-api";
import ChatApi "mixins/chat-api";
import MailApi "mixins/mail-api";
import FriendsApi "mixins/friends-api";
import Migration "migration";


(with migration = Migration.run)
actor {
  // --- State ---
  let users : List.List<UserTypes.UserInternal> = List.empty();
  let notes : List.List<NoteTypes.NoteInternal> = List.empty();
  let chatMessages : List.List<ChatTypes.ChatMessage> = List.empty();
  let mails : List.List<MailTypes.MailInternal> = List.empty();
  let friendRequests : List.List<FriendTypes.FriendRequest> = List.empty();
  let privateMessages : List.List<FriendTypes.PrivateMessageInternal> = List.empty();

  // Counter wrappers passed to mixins
  let noteCounter = { var value = 0 };
  let messageCounter = { var value = 0 };
  let mailCounter = { var value = 0 };
  let pmCounter = { var value = 0 };

  // Online threshold: 60 seconds in nanoseconds
  let onlineThresholdNs : Int = 60_000_000_000;

  // --- Users API ---

  public shared ({ caller }) func register(username : Text, passwordHash : Text) : async UserTypes.AuthResult {
    UsersApi.register(users, caller, username, passwordHash, Time.now());
  };

  public shared ({ caller }) func login(passwordHash : Text) : async UserTypes.AuthResult {
    UsersApi.login(users, caller, passwordHash, Time.now());
  };

  public query func getProfile(id : UserTypes.UserId) : async ?UserTypes.User {
    UsersApi.getProfile(users, id, Time.now() - onlineThresholdNs);
  };

  public shared ({ caller }) func updateProfile(update : UserTypes.ProfileUpdate) : async UserTypes.AuthResult {
    UsersApi.updateProfile(users, caller, update);
  };

  public query func listUsers() : async [UserTypes.User] {
    UsersApi.listUsers(users, Time.now() - onlineThresholdNs);
  };

  public shared ({ caller }) func ping() : async () {
    UsersApi.heartbeat(users, caller, Time.now());
  };

  public shared ({ caller }) func setUsernameEffect(targetUsername : Text, effect : UserTypes.UsernameEffect) : async { #ok; #err : Text } {
    UsersApi.setUsernameEffect(users, caller, targetUsername, effect);
  };

  public shared ({ caller }) func setTextPlate(targetUsername : Text, plate : UserTypes.TextPlate) : async { #ok; #err : Text } {
    UsersApi.setTextPlate(users, caller, targetUsername, plate);
  };

  public shared ({ caller }) func setUserRole(targetUsername : Text, role : UserTypes.Role) : async { #ok; #err : Text } {
    UsersApi.setUserRole(users, caller, targetUsername, role);
  };

  // --- Notes API ---

  public shared ({ caller }) func createNote(input : NoteTypes.NoteInput) : async NoteTypes.NoteResult {
    NotesApi.createNote(notes, noteCounter, caller, input, Time.now());
  };

  public query ({ caller }) func getNotes() : async [NoteTypes.Note] {
    NotesApi.getNotes(notes, caller);
  };

  public query ({ caller }) func getNote(id : NoteTypes.NoteId) : async ?NoteTypes.Note {
    NotesApi.getNote(notes, caller, id);
  };

  public shared ({ caller }) func updateNote(id : NoteTypes.NoteId, input : NoteTypes.NoteInput) : async NoteTypes.NoteResult {
    NotesApi.updateNote(notes, caller, id, input, Time.now());
  };

  public shared ({ caller }) func deleteNote(id : NoteTypes.NoteId) : async { #ok; #err : Text } {
    NotesApi.deleteNote(notes, caller, id);
  };

  // --- Chat API ---

  public shared ({ caller }) func sendMessage(body : Text) : async { #ok : ChatTypes.ChatMessage; #err : Text } {
    ChatApi.sendMessage(chatMessages, users, messageCounter, caller, body, Time.now());
  };

  public query func getMessages(limit : Nat) : async [ChatTypes.ChatMessage] {
    ChatApi.getMessages(chatMessages, limit);
  };

  // --- Mail API ---

  public shared ({ caller }) func sendMail(input : MailTypes.MailInput) : async MailTypes.MailResult {
    MailApi.sendMail(mails, users, mailCounter, caller, input, Time.now());
  };

  public query ({ caller }) func getInbox() : async [MailTypes.Mail] {
    MailApi.getInbox(mails, users, caller);
  };

  public query ({ caller }) func getSent() : async [MailTypes.Mail] {
    MailApi.getSent(mails, users, caller);
  };

  public shared ({ caller }) func markRead(id : MailTypes.MailId) : async { #ok; #err : Text } {
    MailApi.markRead(mails, users, caller, id);
  };

  // --- Friends API ---

  public shared ({ caller }) func sendFriendRequest(toUsername : Text) : async { #ok; #err : Text } {
    FriendsApi.sendFriendRequest(friendRequests, users, caller, toUsername, Time.now());
  };

  public shared ({ caller }) func acceptFriendRequest(fromUsername : Text) : async { #ok; #err : Text } {
    FriendsApi.acceptFriendRequest(friendRequests, users, caller, fromUsername);
  };

  public shared ({ caller }) func rejectFriendRequest(fromUsername : Text) : async { #ok; #err : Text } {
    FriendsApi.rejectFriendRequest(friendRequests, users, caller, fromUsername);
  };

  public query ({ caller }) func getFriendRequests() : async [FriendTypes.FriendRequest] {
    FriendsApi.getFriendRequests(friendRequests, users, caller);
  };

  public query ({ caller }) func getFriends() : async [UserTypes.User] {
    FriendsApi.getFriends(friendRequests, users, caller, Time.now() - onlineThresholdNs);
  };

  public shared ({ caller }) func sendPrivateMessage(toUsername : Text, body : Text) : async { #ok; #err : Text } {
    FriendsApi.sendPrivateMessage(privateMessages, users, pmCounter, caller, toUsername, body, Time.now());
  };

  public query ({ caller }) func getPrivateMessages(withUsername : Text) : async [FriendTypes.PrivateMessage] {
    FriendsApi.getPrivateMessages(privateMessages, users, caller, withUsername);
  };

  public shared ({ caller }) func markPrivateMessageRead(id : FriendTypes.PrivateMessageId) : async { #ok; #err : Text } {
    FriendsApi.markPrivateMessageRead(privateMessages, users, caller, id);
  };
};
