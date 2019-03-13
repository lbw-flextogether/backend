const BaseJoi = require("joi");
const JoiTimezone = require("joi-timezone");
const JoiPhoneNumber = require("joi-phone-number");
const Joi = BaseJoi.extend([JoiTimezone, JoiPhoneNumber]);

const inviteSchema = {
  is_companion: Joi.boolean().required(),

  name: Joi.string()
    .min(2)
    .max(128)
    .required(),

  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),

  phone_number: Joi.string()
    .phoneNumber()
    .min(10)
    .max(15)
    .required(),

  notification_preference: Joi.any()
    .valid(["Text", "Email", "Text & Email"])
    .required(),

  mobility_level: Joi.any()
    .valid(["Low", "Medium", "High"])
    .required(),

  timezone: Joi.string()
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
      timeslots: Joi.array().items(
        Joi.any().valid([
          "6:00 am",
          "6:30 am",
          "7:00 am",
          "7:30 am",
          "8:00 am",
          "8:30 am",
          "9:00 am",
          "9:30 am",
          "10:00 am",
          "10:30 am",
          "11:00 am",
          "11:30 am",
          "12:00 pm",
          "12:30 pm",
          "1:00 pm",
          "1:30 pm",
          "2:00 pm",
          "2:30 pm",
          "3:00 pm",
          "3:30 pm",
          "4:00 pm",
          "4:30 pm",
          "5:00 pm",
          "5:30 pm",
          "6:00 pm",
          "6:30 pm",
          "7:00 pm",
          "7:30 pm",
          "8:00 pm",
          "8:30 pm",
          "9:00 pm",
          "9:30 pm",
          "10:00 pm",
          "10:30 pm",
          "11:00 pm"
        ])
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
    .min(10)
    .max(15)
    .required(),

  recipient_mobility_level: Joi.any()
    .valid(["Low", "Medium", "High"])
    .required()
};

module.exports = inviteSchema;
