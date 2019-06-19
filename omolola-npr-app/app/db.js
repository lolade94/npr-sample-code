const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://localhost:27017/songs";

var _db;

module.exports = {
  connectToServer: (callback) => {
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) =>{
      _db = client.db("songs");
      return callback(err);
    });
  },
  getDB: () => {
    return _db;
  }
};
