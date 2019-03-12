const express = require("express");
const Invites = require("../models/invitesModel");
const Joi = require("joi");
const invitesSchemas = require("../schemas/schemas");

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
  const invite = await Invites.getByToken();
  res.status(200).json(invite);
});

// Confirm invite by token

router.post("/:token/confirm", async (req, res) => {
  res.status(201).end();
});

module.exports = router;
