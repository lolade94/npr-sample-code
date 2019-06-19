const router = require("express").Router();
const mongodb = require("mongodb");
const multer = require("multer");
const ObjectID = require("mongodb").ObjectID;
const { Readable } = require("stream");
const db = require("./db").getDB();


router.get("/songs/:trackID", (req, res) => {
  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  const collection = new mongodb.GridFSBucket(db, {
    bucketName: "songs"
  });

  const trackID = new ObjectID(req.params.trackID);
  const downloadStream = collection.openDownloadStream(trackID);

  downloadStream.on("data", chunk => {
    res.write(chunk);
  });

  downloadStream.on("error", chunk => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
});

router.post("/songs/upload", function(req, res) {
  const storage = multer.memoryStorage()
  const upload = multer({
    storage: storage
  }).single("track")(req, res, err => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Upload Request Validation Failed" });
    }

    if (!req.body.name) {
      return res.status(400).json({ message: "No track name in request body" });
    }

    const trackName = req.body.name;

    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    const collection = new mongodb.GridFSBucket(db, {
      bucketName: "songs"
    });

    const uploadStream = collection.openUploadStream(trackName);
    const id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on("error", () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on("finish", () => {
      return res.status(201).json({
        message: "File uploaded successfully, stored under Mongodb" + id
      });
    });
  });
});

module.exports = router;
