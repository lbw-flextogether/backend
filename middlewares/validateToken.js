const tokenService = require("../services/tokenService");

async function validateToken(req, res, next) {
  try {
    const decoded = await tokenService.verifyToken(req.params.token);
    req.decoded = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid token provided" });
  }
}

module.exports = validateToken;
