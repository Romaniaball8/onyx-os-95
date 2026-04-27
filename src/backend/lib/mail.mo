import List "mo:core/List";
import Types "../types/mail";

module {
  public type MailList = List.List<Types.MailInternal>;

  // Creates a new mail record (does NOT add to the list)
  public func newMail(
    id : Types.MailId,
    sender : Types.UserId,
    senderUsername : Text,
    input : Types.MailInput,
    now : Types.Timestamp,
  ) : Types.MailInternal {
    {
      id;
      sender;
      senderUsername;
      recipientUsername = input.recipientUsername;
      subject = input.subject;
      body = input.body;
      sentAt = now;
      var isRead = false;
    };
  };

  // Converts internal mail to shareable record
  public func toPublic(mail : Types.MailInternal) : Types.Mail {
    {
      id = mail.id;
      sender = mail.sender;
      senderUsername = mail.senderUsername;
      recipientUsername = mail.recipientUsername;
      subject = mail.subject;
      body = mail.body;
      sentAt = mail.sentAt;
      isRead = mail.isRead;
    };
  };

  // Returns inbox (mail where recipientUsername matches) for a user, newest first
  public func inbox(mails : MailList, recipientUsername : Text) : [Types.Mail] {
    mails
      .filter(func(m) { m.recipientUsername == recipientUsername })
      .map<Types.MailInternal, Types.Mail>(func(m) { toPublic(m) })
      .reverse()
      .toArray();
  };

  // Returns sent mail for a user, newest first
  public func sent(mails : MailList, senderUsername : Text) : [Types.Mail] {
    mails
      .filter(func(m) { m.senderUsername == senderUsername })
      .map<Types.MailInternal, Types.Mail>(func(m) { toPublic(m) })
      .reverse()
      .toArray();
  };

  // Finds a mail by id (returns null if not found)
  public func findById(mails : MailList, id : Types.MailId) : ?Types.MailInternal {
    mails.find(func(m) { m.id == id });
  };
};
