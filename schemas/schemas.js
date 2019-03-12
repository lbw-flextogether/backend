const BaseJoi = require("joi");
const JoiTimezone = require("joi-timezone");
const JoiPhoneNumber = require("joi-phone-number");
const Joi = BaseJoi.extend([JoiTimezone, JoiPhoneNumber]);

const inviteSchema = {
  name: Joi.string()
    .min(2)
    .max(128)
    .required(),

  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),

  phone_number: Joi.string()
    .phoneNumber()
    .required(),

  notification_preference: Joi.any()
    .valid(["Text", "Email", "Text & Email"])
    .required(),

  mobility_level: Joi.any()
    .valid(["Low", "Medium", "High"])
    .required(),

  time_zone: Joi.string()
    .timezone()
    .required(),

  availability: Joi.array()
    .items({
      day: Joi.any().valid([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thrusday",
        "Friday",
        "Saturday",
        "Sunday"
      ]),
      time_slots: Joi.array().items(
        Joi.any().valid(["6:00 am", "6:30 am", "7:00 am", "7:30 am", "8:00 am"])
      )
    })
    .required(),

  recipient_name: Joi.string()
    .min(2)
    .max(128)
    .required(),

  recipient_email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),

  recipient_phone_number: Joi.string()
    .phoneNumber()
    .required(),

  recipient_mobility_level: Joi.any()
    .valid(["Low", "Medium", "High"])
    .required()
};

module.exports = inviteSchema;
