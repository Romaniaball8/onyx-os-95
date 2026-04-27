import List "mo:core/List";
import Principal "mo:core/Principal";
import MailTypes "../types/mail";
import UserTypes "../types/users";
import MailLib "../lib/mail";
import UserLib "../lib/users";

module MailApi {
  public type MailList = List.List<MailTypes.MailInternal>;
  public type UserList = List.List<UserTypes.UserInternal>;
  public type Counter = { var value : Nat };

  // Compose and send an internal mail to a registered user (by username).
  public func sendMail(
    mails : MailList,
    users : UserList,
    counter : Counter,
    caller : MailTypes.UserId,
    input : MailTypes.MailInput,
    now : MailTypes.Timestamp,
  ) : MailTypes.MailResult {
    switch (UserLib.findById(users, caller)) {
      case null { #err("Sender not registered") };
      case (?senderUser) {
        switch (UserLib.findByUsername(users, input.recipientUsername)) {
          case null { #err("Recipient not found") };
          case (?_) {
            let id = counter.value;
            counter.value += 1;
            let mail = MailLib.newMail(id, caller, senderUser.username, input, now);
            mails.add(mail);
            #ok(MailLib.toPublic(mail));
          };
        };
      };
    };
  };

  // Get inbox for the caller (messages addressed to caller's username).
  public func getInbox(
    mails : MailList,
    users : UserList,
    caller : MailTypes.UserId,
  ) : [MailTypes.Mail] {
    switch (UserLib.findById(users, caller)) {
      case null { [] };
      case (?user) { MailLib.inbox(mails, user.username) };
    };
  };

  // Get sent mail for the caller.
  public func getSent(
    mails : MailList,
    users : UserList,
    caller : MailTypes.UserId,
  ) : [MailTypes.Mail] {
    switch (UserLib.findById(users, caller)) {
      case null { [] };
      case (?user) { MailLib.sent(mails, user.username) };
    };
  };

  // Mark a mail as read (caller must be recipient).
  public func markRead(
    mails : MailList,
    users : UserList,
    caller : MailTypes.UserId,
    id : MailTypes.MailId,
  ) : { #ok; #err : Text } {
    switch (UserLib.findById(users, caller)) {
      case null { #err("User not registered") };
      case (?user) {
        switch (MailLib.findById(mails, id)) {
          case null { #err("Mail not found") };
          case (?mail) {
            if (mail.recipientUsername != user.username) {
              return #err("Not authorized to mark this mail as read");
            };
            mail.isRead := true;
            #ok;
          };
        };
      };
    };
  };
};
