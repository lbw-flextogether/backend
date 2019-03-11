const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const inviteRoute = require("../routes/invitesRoute");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));
server.use("/api/invite", inviteRoute);

server.get("/", async (req, res, next) => {
  res.send(`Flextogether API`);
});

module.exports = server;
