require("dotenv").config();
const express = require("express");
const validation = require("../validation");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const { authToken } = require("../tokenValidation");
const tokenValidation = require("../tokenValidation");

const client = new MongoClient("mongodb://localhost/testDb");
const users = client.db().collection("users");
const profilePhotos = client.db().collection("profilephotos");

router.get("/user", tokenValidation.authToken, async (req, res) => { 
  // Gets the logged user
  const tokenUser = req.user;
  console.log(tokenUser);
  const id = tokenUser._id;

  const user = await users.findOne({_id: new ObjectId(id)})
  if ( user == null ) 
    res.status(400).send("User not found");

  res.send(user);
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await users.findOne({ email: email });
  if (user == null) return res.status(400).send("Email wrong");

  const passCorrect = await bcrypt.compare(password, user.password);
  if (!passCorrect) return res.status(400).send("Password wrong");

  // CREATING ACCESS TOKEN
  const token = jwt.sign(user, process.env.ACCESS_TOKEN);
  console.log(token);

  res.header("authToken", token).send();
});

router.post("/register", async (req, res) => {
  const { username, password, email, firstName, lastName, image64 } = req.body;

  // HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);

  var user = {
    username: username,
    password: hashedPassword,
    email: email,
    firstName: firstName,
    lastName: lastName,
  };

  const { error } = validation.registerValidation(user);
  if (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }

  // CHECKING IF THE USER IS IN DB
  const emailExists = await users.findOne({ email: email });
  if (emailExists != null)
    return res.status(400).send("Email already assigned");

  const response = await users.insertOne(user);

  // Adding the profile image to separate collection
  const userId = response.insertedId;
  await profilePhotos.insertOne({ userId: userId, image64: image64 });

  res.status(201).send("User Added");
});

router.get("/user/:id", tokenValidation.authToken, async (req, res) => {
  try {
    const user = await users.findOne({ _id: new ObjectId(req.params.id) });
    console.log(user);
    if (user == null) res.status(400).send("Bad Request, user not found");
    res.send(user);
  } catch (err) {
    res.status(400).send("User not found");
  }
});

router.post("/user/update", tokenValidation.authToken, async (req, res) => {
  try
  {
    const {name, username, email, image64} = req.body;
    const user = req.user;

    if ( email.toLowerCase() != user.email.toLowerCase() )
    {
      // Checking if the mail is already taken;
      const isTaken = await users.findOne({email: email.toLowerCase()});
      if ( isTaken != null )
        return res.status(400).send("Email already taken");
    }

    if ( username.toLowerCase() != user.username.toLowerCase() )
    {
      // Checking if the username is taken
      const isTaken = await users.findOne({username: username.toLowerCase()});
      if ( isTaken != null )
        return res.status(400).send("Username already taken");
    }

    const response = await users.updateOne({_id: new ObjectId(user._id)}, {$set: {name: name, username: username.toLowerCase(), email: email.toLowerCase()}});
    console.log(response);
  
    // Updating profile picture
    const profilephotos = client.db().collection("profilephotos");
    const r = await profilephotos.updateOne({userId: new ObjectId(user._id)}, {$set: {image64: image64}});
    console.log(r);
  
    res.send("User updated");
  }
  catch (err)
  {
    res.status(400).send("All parameters must be specified");
  }

});

module.exports = router;
