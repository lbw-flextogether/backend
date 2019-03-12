const express = require("express");
const Invites = require("../models/invitesModel");
const Joi = require("joi");
const invitesSchemas = require("../schemas/schemas");
const Email = require("../services/email");
const tokenService = require("../services/tokenService");

const router = express.Router();

router.use(express.json());

// Create an inivite
router.post("/", async (req, res) => {
  try {
    const { value, error } = Joi.validate(req.body, invitesSchemas);

    if (error != null) {
      res.status(400).json(error.details[0]);
    } else {
      const invite = await Invites.insert(value);
      await Email.sendVerficationEmail(invite);
      res.status(201).json(invite);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error while saving an invite."
    });
  }
});

// Verfiy email
router.post("/:token/verify", async (req, res) => {
  res.status(201).end();
});

// Get invite by token
router.get("/:token", async (req, res) => {
  try {
    const decoded = await tokenService.verifyToken(req.params.token);
    const invite = await Invites.getById(decoded.id);

    res.status(200).json(invite);
  } catch (error) {
    console.log(error);

    if (error.name === "JsonWebTokenError") {
      res.status(400).json({ message: "Invalid token provided" });
    } else {
      res.status(500).json({
        message: "There was an error to get invite."
      });
    }
  }
});

// Confirm invite by token

router.post("/:token/confirm", async (req, res) => {
  res.status(201).end();
});

module.exports = router;
