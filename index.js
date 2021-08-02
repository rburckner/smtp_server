"use strict";
const debug = require("debug")("smtp-server");
const simpleParser = require("mailparser").simpleParser;

require("./src/db/mongo");
const Message = require("./src/db/models/message");
const messageHelper = require("./src/messageHelper");
const SmtpServer = require("./src/smtpServer");

const port = process.env.SMTP_PORT || 8025;
let socket = null;
const socketServer = require("./src/socket")();
socketServer.on("connection", (connection) => {
  debug(`Socket client connected.`);
  connection.on("close", function connectionCloseListener(socket) {
    debug(`Socket client connection closed.`);
  });
  socket = connection;
});
socketServer.on("error", function errorListener(err) {
  debug(`Socket Server error: ${err.toString()}`);
  console.error(err);
});

const onData = async (stream, session, callback) => {
  debug(`Message received.`);
  simpleParser(stream)
    .then((parsed) => {
      const message = new Message({
        text: parsed.text,
        subject: parsed.subject,
        date: parsed.date,
        to: parsed.to.text || "",
        from: parsed.from.text || "",
        messageId: parsed.messageId,
      });

      for (const attachment of parsed.attachments) {
        message.attachments.push({
          content: attachment.content,
          contentType: attachment.contentType,
          contentDisposition: attachment.contentDisposition,
          filename: attachment.filename,
          size: attachment.size,
        });
      }
      return message.save();
    })
    .then((savedDoc) => {
      socket.write(messageHelper(savedDoc));
      callback();
    })
    .catch((err) => {
      console.error(err);
      callback(`Message parsing error.`);
    });
};

let authorizedClients = [];
if (typeof process.env.AUTHORIZE_CLIENTS !== "undefined") {
  authorizedClients = process.env.AUTHORIZE_CLIENTS.split(",");
}

SmtpServer({
  authorizedClients,
  serverOpts: { onData },
})
  .on("error", (err) => {
    console.log("Error %s", err.message);
  })
  .listen(port);
