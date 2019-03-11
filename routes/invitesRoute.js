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

module.exports = router;
