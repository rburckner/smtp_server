"use strict";
const debug = require("debug")("smtp-server:socket:server");
const fs = require("fs");
const net = require("net");

const SOCKETFILE = "/tmp/smtp-server.sock";
const connections = {};

module.exports = (opts = {}) => {
  const pathOrPort = opts.path || opts.port || SOCKETFILE;

  function createServer(pathOrPort) {
    return net
      .createServer(function connectionListener(connection) {
        debug(`Socket client connected.`);
        connection.on("close", function connectionCloseListener(socket) {
          debug(`Socket client connection closed.`);
        });
      })
      .listen(pathOrPort, function boundHandler() {
        debug(`IPC Socket server started`);
      });
  }

  try {
    if (typeof pathOrPort === "string") {
      fs.accessSync(pathOrPort, fs.constants.W_OK);
      if (fs.statSync(pathOrPort).isSocket()) {
        fs.unlinkSync(pathOrPort);
      }
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  return createServer(pathOrPort);
};
