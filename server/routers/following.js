require("dotenv").config();
const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const tokenValidation = require("../tokenValidation");

const client = new MongoClient(process.env.DB_CONNECT);
const following = client.db().collection("following");

router.get("/followers/:id", tokenValidation.authToken, async (req, res) => {
  const user_id = req.params.id;
  try {
    var users = await following
      .find({ following_id: new ObjectId(user_id) })
      .project({ follower_id: 1 })
      .toArray();
    res.send(users);
  } catch (err) {
    return res.send(err);
  }
});

router.get("/following/:id", tokenValidation.authToken, async (req, res) => {
  try {
    var users = await following
      .find({ follower_id: new ObjectId(req.params.id) })
      .project({ following_id: 1 })
      .toArray();
    return res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Checking if you follow someone 0-false 1-true
router.get("/:id", tokenValidation.authToken, async (req, res) => {
  try {
    following
      .findOne({
        follower_id: new ObjectId(req.user._id),
        following_id: new ObjectId(req.params.id),
      })
      .then((user) => {
        if (user) res.status(200).send("1");
        else res.status(200).send("0");
      });
  } catch (err) {
    return res.status(400).send("Error");
  }
});

router.post("/:id", tokenValidation.authToken, async (req, res) => {
  const userId = req.user._id;
  // Checking if the user with :id exists
  try {
    client
      .db()
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((user) => {
        if (user == null) {
          return res.status(400).send("User id provided is not valid!");
        }
      });
  } catch (err) {
    return res.status(400).send("User id provided is not valid!");
  }

  // Checking if not already following
  try {
    following
      .findOne({
        follower_id: new ObjectId(req.user._id),
        following_id: new ObjectId(req.params.id),
      })
      .then((user) => {
        if (user) return res.status(400).send("Already following the user");
        else {
          following
            .insertOne({
              follower_id: new ObjectId(userId),
              following_id: new ObjectId(req.params.id),
            })
            .then((response) => {
              return res.send(response);
            });
        }
      });
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/:id", tokenValidation.authToken, (req, res) => {
  following
    .deleteOne({
      follower_id: new ObjectId(req.user._id),
      following_id: new ObjectId(req.params.id),
    })
    .then((response) => {
        res.status(200).send("Unfollowed");
    });
});

module.exports = router;
