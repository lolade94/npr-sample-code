"use-strict";

// Upload song, genre, keywords, artist, album, date-created

// retrieve songs

// create a playlist

// suggest new songs

// play song from a playlist

const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db");
const app = express();
app.use(bodyParser.json());

db.connectToServer((err, client) => {
  if (err) {
    console.log("Failed connection to mongodb server", err);
  }
  const router = require("./router.js");
  app.use("/", router);

  app.listen(3000, () => {
    console.log("Server is up and running");
  });
});
