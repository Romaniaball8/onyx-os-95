import Common "common";

module {
  public type MailId = Common.MailId;
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  // Internal mail record
  public type MailInternal = {
    id : MailId;
    sender : UserId;
    senderUsername : Text;
    recipientUsername : Text;
    subject : Text;
    body : Text;
    sentAt : Timestamp;
    var isRead : Bool;
  };

  // Public mail record (shareable)
  public type Mail = {
    id : MailId;
    sender : UserId;
    senderUsername : Text;
    recipientUsername : Text;
    subject : Text;
    body : Text;
    sentAt : Timestamp;
    isRead : Bool;
  };

  // Input for composing a message
  public type MailInput = {
    recipientUsername : Text;
    subject : Text;
    body : Text;
  };

  public type MailResult = { #ok : Mail; #err : Text };
};
