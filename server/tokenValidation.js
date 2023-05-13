require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtDecoder = require("jwt-decode");

function authToken(req, res, next) {
  const tokenHeader = req.header("authToken");
  if (tokenHeader == null || tokenHeader == "")
    return res.status(401).send("No auth token");

  try {
    const token = tokenHeader.split(" ")[1];
    const user = jwtDecoder(token, process.env.ACCESS_TOKEN);
    req.user = user;
  } catch (err) {
    res.status(403).send('Auth token not valid');
  }

  next();
}

module.exports = {
  authToken: authToken,
};
