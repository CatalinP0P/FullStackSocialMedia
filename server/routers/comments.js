require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const tokenValidation = require('../tokenValidation');

const router = express.Router();
const client = new MongoClient(process.env.DB_CONNECT);
const comments = client.db().collection("comments");

router.get("/:postid", async (req, res) => {
  const postid = req.params.postid;
  const comms = await comments
    .find({ post_id: postid })
    .sort({date: -1})
    .toArray();

  res.send(comms);
});

router.post("/:postid", tokenValidation.authToken, async (req, res) => {
    const postid = req.params.postid;
    const comment = req.body.comment;

    const response = await comments.insertOne({post_id: postid, user_id: req.user._id, comment: comment, date: new Date()});
    res.send(response);
});

module.exports = router;
