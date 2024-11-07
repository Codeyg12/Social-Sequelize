const { db, DataTypes } = require("../db/connection");

const Comment = db.define("Comment", {
  body: DataTypes.STRING,
  createdAt: DataTypes.DATE,
});

module.exports = Comment;
