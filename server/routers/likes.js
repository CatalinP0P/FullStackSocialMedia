const express = require("express");
const { default: jwtDecode } = require("jwt-decode");
const { MongoClient, ObjectId } = require("mongodb");
const tokenValidation = require("../tokenValidation");

const client = new MongoClient("mongodb://localhost/testDb");
const likes = client.db().collection("likes");

const router = express.Router();

router.get("/count/:postid", async (req, res) => {
  const { postid } = req.params;
  if (postid == null) return res.status(400).send();

  try {
    const count = (
      await likes.find({ post_id: new ObjectId(postid) }).toArray()
    ).length;
    console.log(count);
    res.send(count + "");
  } catch (err) {
    res.status(400).send("error");
  }
});

router.get("/profiles/:postid", tokenValidation.authToken, async (req, res) => {
  var id = new ObjectId(req.params.postid);
  const profiles = await likes.aggregate([
    {$match: {post_id: id}},
    {$lookup: {from: "users", localField: "user_id", foreignField: "_id", as: "user" }},
    {$lookup: {from: "profilephotos", localField: "user_id", foreignField: "userId", as: "photo"}},
    {$project: {user: {_id: 1, username: 1}, photo: {image64: 1}} }
  ]).toArray();

  res.send(profiles);
})

router.get("/status/:postid", tokenValidation.authToken, async (req, res) => {
  const user = req.user;
  try {
    const postid = req.params.postid;
    const liked = await likes.findOne({
      user_id: new ObjectId(user._id),
      post_id: new ObjectId(postid),
    });
    if (liked == null) {
      res.status(200).send("0");
    } else {
      res.status(200).send("1");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/:postid", tokenValidation.authToken, async (req, res) => {
  console.log("Entered api");
  const user = req.user;
  const postid = req.params.postid;
  console.log(postid);

  // Checking if the post already liked
  try {
    const like = await likes.findOne({
      user_id: new ObjectId(user._id),
      post_id: new ObjectId(req.params.postid),
    });
    if (like) {
      await likes.deleteMany({
        user_id: new ObjectId(user._id),
        post_id: new ObjectId(req.params.postid),
      });
      res.send("Like Removed");
      return;
    }

    console.log(user._id);
    await likes.insertOne({
      post_id: new ObjectId(postid),
      user_id: new ObjectId(user._id),
    });

    res.send("Liked");
  } catch (err) {
    res.status(400).send("Id's are not valid");
  }
});

module.exports = router;
