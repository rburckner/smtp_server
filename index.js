"use strict";
const fs = require("fs");
const path = require("path");

// Build file structure
const messageDatabasePath = path.join(process.cwd(), "messages");
fs.mkdirSync(messageDatabasePath, { recursive: true });

const onData = (stream, session, callback) => {
  const timestamp = Date.now().toString();
  const filepath = path.join(messageDatabasePath, timestamp);
  const writeStream = fs.createWriteStream(filepath);
  stream.pipe(writeStream);
  stream.on("end", () => {
    writeStream.close();
    callback();
  });
};

const authorizedClients = [];
authorizedClients.push("127.0.0.1");
const server = require("./src/smtp-server")({
  authorizedClients,
  serverOpts: { onData },
});
server.listen(8025);

server.on("error", (err) => {
  console.log("Error %s", err.message);
});
