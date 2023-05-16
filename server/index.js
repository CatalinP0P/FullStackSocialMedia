const PORT = 4000;

require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const jwtDecoder = require("jwt-decode");
const { MongoClient } = require("mongodb");

var jsonParser = bodyParser.json({
  limit: 1024 * 1024 * 10,
  type: "application/json",
});
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: 1024 * 1024 * 10,
  type: "application/x-www-form-urlencoded",
});

const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.json());

// Auth route
const authRouter = require("./routers/auth");
app.use("/auth", authRouter);

// Posts route
const postRouter = require("./routers/posts");
app.use("/posts", postRouter);

// Profile photos route
const profilePhotoRoute = require("./routers/profilephotos");
app.use("/profilephotos", profilePhotoRoute);

// Likes route
const likesRouter = require('./routers/likes');
app.use('/likes', likesRouter);

// Comments route
const commentsRouter = require('./routers/comments');
app.use("/comments", commentsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
