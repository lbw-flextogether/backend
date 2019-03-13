const express = require("express");
const InvitesModel = require("../models/invitesModel");
const UsersModel = require("../models/usersModel");
const Joi = require("joi");
const {
  inviteSchema,
  manualConfirmationSchema,
  confirmationSchema
} = require("../schemas/schemas");
const Email = require("../services/email");
const validateToken = require("../middlewares/validateToken");

const router = express.Router();

router.use(express.json());

// Create an inivite and send an email to verify user1 email
router.post("/", async (req, res) => {
  try {
    const { value, error } = Joi.validate(req.body, inviteSchema);

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

//  Verfiy email - when user1 verifies email update "user1_verified" and then send an email to user2 with user1 availability
router.post("/:token/verify", validateToken, async (req, res) => {
  try {
    const invite = await InvitesModel.getById(req.decoded.id);
    const user1 = await UsersModel.getById(invite.user1_id);
    const user2 = await UsersModel.getById(invite.user2_id);
    await InvitesModel.update(invite.id, { user1_verified: true });

    await Email.sendInvitation(invite.id, user1.name, user2.name, user2.email);
    res.status(201).end();
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
    const invite = await InvitesModel.getById(req.decoded.id);
    const user1 = await UsersModel.getById(invite.user1_id);
    const user2 = await UsersModel.getById(invite.user2_id);

    res.status(200).json({
      id: req.decoded.id,
      is_companion: Boolean(invite.user1_is_companion),
      name: user1.name,
      email: user1.email,
      phone_number: user1.phone_number,
      timezone: user1.timezone,
      notification_preference: user1.notification_preference,
      mobility_level: user1.mobility_level,
      availability: invite.user1_availability,
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
  try {
    const { value, error } = Joi.validate(req.body, confirmationSchema);

    if (error != null) {
      res.status(400).json(error.details[0]);
    } else {
      const timezone = value.timezone;
      const availability = value.availability;

      const invite = await InvitesModel.getById(req.decoded.id);

      // update user2 timezone
      await UsersModel.update(invite.user2_id, { timezone });

      // calculate meetup_day, meetup_time
      const meetup_day = availability[0].day;
      const timeslots = availability[0].timeslots;
      let meetup_time;

      if (timeslots.length === 1) {
        meetup_time = timeslots[0];
      } else {
        meetup_time = timeslots[Math.round(timeslots.length / 2) - 1];
      }

      // update invite user2_availibilty, meetup_day, meetup_time
      await InvitesModel.update(req.decoded.id, {
        user2_availability: JSON.stringify(value.availability),
        meetup_day,
        meetup_time
      });

      const user1 = await UsersModel.getById(invite.user1_id);
      const user2 = await UsersModel.getById(invite.user2_id);
      // send user1 email
      await Email.sendConfirmation(
        user1.name,
        user1.email,
        user2.name,
        meetup_day,
        meetup_time
      );
      // send user2 email
      await Email.sendConfirmation(
        user2.name,
        user2.email,
        user1.name,
        meetup_day,
        meetup_time
      );

      res.status(201).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error confirming this request."
    });
  }
});

// Confirm invite by token
router.post("/:token/manual_confirm", validateToken, async (req, res) => {
  try {
    const { value, error } = Joi.validate(req.body, manualConfirmationSchema);

    if (error != null) {
      res.status(400).json(error.details[0]);
    } else {
      // update meetup time and day that was entered manually
      await InvitesModel.update(req.decoded.id, value);
      const invite = await InvitesModel.getById(req.decoded.id);
      const user1 = await UsersModel.getById(invite.user1_id);
      const user2 = await UsersModel.getById(invite.user2_id);

      // send user1 email
      await Email.sendConfirmation(
        user1.name,
        user1.email,
        user2.name,
        value.meetup_day,
        value.meetup_time
      );

      // send user2 email
      await Email.sendConfirmation(
        user2.name,
        user2.email,
        user1.name,
        value.meetup_day,
        value.meetup_time
      );
      res.status(201).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error confirming this request."
    });
  }
});

module.exports = router;
