const express = require("express");
const InvitesModel = require("../models/invitesModel");
const UsersModel = require("../models/usersModel");
const Joi = require("joi");
const invitesSchemas = require("../schemas/schemas");
const Email = require("../services/email");
const validateToken = require("../middlewares/validateToken");

const router = express.Router();

router.use(express.json());

// Create an inivite
router.post("/", async (req, res) => {
  try {
    const { value, error } = Joi.validate(req.body, invitesSchemas);

    if (error != null) {
      res.status(400).json(error.details[0]);
    } else {
      const user1 = await UsersModel.insert({
        name: value.name,
        email: value.email,
        phone_number: value.phone_number,
        notification_preference: value.notification_preference,
        mobility_level: value.mobility_level,
        timezone: value.timezone
      });
      const user2 = await UsersModel.insert({
        name: value.recipient_name,
        email: value.recipient_email,
        phone_number: value.recipient_phone_number,
        notification_preference: value.notification_preference,
        mobility_level: value.recipient_mobility_level,
        timezone: value.timezone
      });

      const invite = await InvitesModel.insert({
        user1_id: user1.id,
        user2_id: user2.id,
        user1_availability: value.availability,
        user1_is_companion: value.is_companion,
        user1_verified: false,
        user2_is_companion: !value.is_companion
      });
      await Email.sendVerfication(invite.id, user1.name, user1.email);
      res.status(201).json({ id: invite.id, ...value });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error while saving an invite."
    });
  }
});

// Verfiy email
router.post("/:token/verify", validateToken, async (req, res) => {
  try {
    const invite = await InvitesModel.getById(req.decoded.id);
    const user1 = await UsersModel.getById(invite.user1_id);
    const user2 = await UsersModel.getById(invite.user2_id);
    await InvitesModel.update(invite.id, { user1_verified: true });

    await Email.sendInvitation(invite.id, user1.name, user2.name, user2.email);
    res.status(201).json(invite);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error in verifying user."
    });
  }
});

// Get invite by token
router.get("/:token", validateToken, async (req, res) => {
  try {
    const user1 = await InvitesModel.getUser1(req.decoded.id);
    const user2 = await InvitesModel.getUser2(req.decoded.id);

    res.status(200).json({
      id: req.decoded.id,
      is_companion: Boolean(user1.user1_is_companion),
      name: user1.name,
      email: user1.email,
      phone_number: user1.phone_number,
      timezone: user1.timezone,
      notification_preference: user1.notification_preference,
      mobility_level: user1.mobility_level,
      availability: JSON.parse(user1.user1_availability),
      recipient_name: user2.name,
      recipient_email: user2.email,
      recipient_phone_number: user2.phone_number,
      recipient_mobility_level: user2.mobility_level
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error to get invite."
    });
  }
});

// Confirm invite by token

router.post("/:token/confirm", validateToken, async (req, res) => {
  res.status(201).end();
});

module.exports = router;
