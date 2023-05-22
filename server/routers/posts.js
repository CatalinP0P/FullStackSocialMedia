require("dotenv").config();
const express = require("express");
const router = express.Router();
const tokenValidation = require("../tokenValidation");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

//local: mongodb://localhost/testDb

const client = new MongoClient("mongodb://localhost/testDb");
const posts = client.db().collection("posts");

router.get("/", tokenValidation.authToken, async (req, res) => {
  var postsDocuments = await posts.find({}).sort({ date: -1 }).toArray();
  console.log(postsDocuments);
  res.send(postsDocuments);
});

router.get("/user/:id", tokenValidation.authToken, async (req, res) => {
  var postDocs = await posts
    .find({ user_id: req.params.id })
    .sort({ date: -1 })
    .toArray();
  res.send(postDocs);
});

router.get("/:number", tokenValidation.authToken, async (req, res) => {
  const number = req.params.number;
  console.log(number);
  var postsDocuments = await posts
    .find({})
    .sort({ date: -1 })
    .limit(parseInt(number))
    .toArray();
  res.send(postsDocuments);
});

router.post("/", tokenValidation.authToken, async (req, res) => {
  const { title, image64 } = req.body;
  console.log(req.body);
  const item = {
    user_id: req.user._id.toString(),
    title: title,
    image64: image64,
    date: new Date(),
  };

  await posts.insertOne(item);
  res.status(200).send("Post added");
});

router.delete("/", tokenValidation.authToken, async (req, res) => {
  const { postId } = req.body;
  if (postId == null) return res.status(400).send("postId not specified");

  const query = { _id: new ObjectId(postId) };
  const post = await posts.findOne(query);

  if (post == null)
    return res.status(400).send("There is no post with the id of postId");
  if (req.user._id.toString() != post._id.toString())
    return res.status(400).send("You can't delete a post that's not yours");

  posts.deleteOne({ _id: new ObjectId(post._id.toString()) });
  res.status(200).send("Post Deleted");
});

router.get("/popular/:days", async (req, res) => {
  const nowDate = new Date();
  nowDate.setDate(nowDate.getDate() - req.params.days);
  console.log(nowDate);

  const dateFormat = `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()}`;
  console.log(dateFormat);

  var likes = client.db().collection("likes");

  const response = await likes.aggregate([
    {$group: {_id: "$post_id", likes: {$count: {}}}},
    {$lookup: {from: "posts", localField: "_id", foreignField: "_id", as: "post"}},
    {$project: {"post.title": 1, count: 1, "post.date": 1, "post.image64": 1, "post._id": 1}},
    {$match: {"post.date" : {$gte: new Date(dateFormat)}}},
    {$sort: {count: -1}}
    ]).toArray(); 
  res.send(response);
});

module.exports = router;
