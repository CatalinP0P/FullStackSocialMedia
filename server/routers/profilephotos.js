require("dotenv").config();

const express = require("express");
const tokenValidation = require("../tokenValidation");
const { MongoClient, ObjectId, OrderedBulkOperation } = require("mongodb");
const jwtDecode = require("jwt-decode");

const client = new MongoClient("mongodb://localhost/testDb")
const profilephotos = client.db().collection("profilephotos");

const router = express.Router();

router.get("/:id", tokenValidation.authToken, async (req, res) => {
    const photo = await profilephotos.findOne({userId: new ObjectId(req.params.id)});
    res.status(200).send(photo.image64);
});

module.exports = router;