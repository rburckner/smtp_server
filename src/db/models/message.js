"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  text: String,
  subject: String,
  date: Date,
  to: String,
  from: String,
  messageId: String,

  contentType: String,
  attachments: [
    {
      content: Buffer,
      contentType: String,
      contentDisposition: String,
      filename: String,
      size: Number,
    },
  ],
});

module.exports = mongoose.model("Message", schema);
