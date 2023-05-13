require("dotenv").config();
const express = require("express");
const validation = require('../validation')
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost/testDb");
const users = client.db().collection("users");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await users.findOne({ email: email });
  if (user == null) return res.status(400).send("Email wrong");

  const passCorrect = await bcrypt.compare(password, user.password);
  if ( !passCorrect ) return res.status(400).send('Password wrong');

  // CREATING ACCESS TOKEN
  const token = jwt.sign(user, process.env.ACCESS_TOKEN);
  console.log(token);

  res.header('authToken', token).send();
});

router.post("/register", async (req, res) => {
  console.log(req.body);
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
    image64: image64,
  };

  const {error} = validation.registerValidation(req.body);
  if ( error )
  {
    console.log(error) 
    return res.status(400).send(error.message);
  }
  
  // CHECKING IF THE USER IS IN DB
  const emailExists = await users.findOne({email: email});
  if ( emailExists != null ) 
    return res.status(400).send('Email already assigned');
  

  console.log(user);
  users.insertOne(user);

  res.status(201).send("User added");
});

module.exports = router;
