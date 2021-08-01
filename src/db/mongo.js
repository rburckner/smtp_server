"use strict";
require("dotenv").config();
const debug = require("debug")("smtp-server:mongoose");
const mongoose = require("mongoose");

const HOST = process.env.MONGODB_HOST || `localhost`;
const PORT = process.env.MONGODB_PORT || 27017;
const COLLECTION = process.env.MONGODB_COLLECTION || `messages`;

const URI = `mongodb://${HOST}:${PORT}/${COLLECTION}`;

debug(`Connecting to: ${URI}`);
mongoose.connect(URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("error", console.error);

mongoose.connection.on("connected", (result) => {
  debug(`Connected to: ${URI}`);
});
