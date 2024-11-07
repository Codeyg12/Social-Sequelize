const { db, DataTypes } = require("../db/connection");

const Like = db.define("Like", {
  reactionType: DataTypes.STRING,
  createdAt: DataTypes.DATE,
});

module.exports = Like;
