require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtDecoder = require("jwt-decode");

function authToken(req, res, next) {
  const tokenHeader = req.header("authToken");
  if (tokenHeader == null || tokenHeader == "")
  {
    console.log('No auth tokenn');
    return res.status(401).send("No auth token");
  }

  try {
    const token = tokenHeader.split(" ")[1];
    console.log(token);
    const user = jwtDecoder(token, process.env.ACCESS_TOKEN);
    req.user = user;
  } catch (err) {
    console.log("Token not valid")
    res.status(403).send('Auth token not valid');
  }
  console.log("Token valid");
  next();
}

module.exports = {
  authToken: authToken,
};
