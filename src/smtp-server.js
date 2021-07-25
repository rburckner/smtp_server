"use strict";
const debug = require("debug")("smtp-server:server");
const SMTPServer = require("smtp-server").SMTPServer;

module.exports = (opts = {}) => {
  let authorizedClients = [];
  let serverOpts = {};

  if (typeof opts === "function") {
    authorizedClients = [];
    serverOpts.onData = opts;
  } else {
    if (Array.isArray(opts.authorizedClients)) {
      authorizedClients = opts.authorizedClients;
    }
    if (typeof opts.serverOpts === "object") {
      serverOpts = opts.serverOpts;
    }
  }

  debug(
    `Authorized clients: ${
      authorizedClients.length > 0 ? authorizedClients.toString() : "ALL"
    }`
  );

  serverOpts.authOptional = true;

  serverOpts.onConnect = (session, callback) => {
    debug(`Client ${session.remoteAddress} connected.`);
    if (authorizedClients.length > 0) {
      if (!authorizedClients.includes(session.remoteAddress)) {
        return callback(
          new Error(
            `Connections are not allowed from ${session.remoteAddress}.`
          )
        );
      }
    }
    return callback();
  };

  serverOpts.onClose = (session) => {
    debug(`Client ${session.remoteAddress} disconnected.`);
  };

  // serverOpts.onData - Check for 'serverOpts.onData'
  if (typeof serverOpts.onData !== "function") {
    throw new Error(`'serverOpts.onData' paramater must be a function.`);
  }

  return new SMTPServer(serverOpts);
};
