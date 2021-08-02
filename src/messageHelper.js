"use strict";
module.exports = (message) => {
  return JSON.stringify({
    id: message.id,
    text: message.text,
    subject: message.subject,
    date: message.date,
    to: message.to,
    from: message.from,
    messageId: message.messageId,
    attachmentCount: message.attachments.length || 0,
  });
};
