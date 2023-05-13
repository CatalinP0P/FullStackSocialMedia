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
  var postsDocuments = await posts.find({}).sort({date: 1}).toArray();
  console.log(postsDocuments);
  res.send(postsDocuments);
});

router.get("/:number", tokenValidation.authToken, async (req, res) => {
  const number = req.params.number;
  console.log(number);
  var postsDocuments = await posts.find({}).limit(parseInt(number)).toArray();
  res.send(postsDocuments);
});

router.post("/", tokenValidation.authToken, async (req, res) => {
  const { title, image64 } = req.body;
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

module.exports = router;
