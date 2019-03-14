const jwt = require("jsonwebtoken");

function generateToken(data) {
  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(data, process.env.JWT_SECRET || "jwt_dev_token", options);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || "jwt_dev_token");
}

module.exports = {
  generateToken,
  verifyToken
};
