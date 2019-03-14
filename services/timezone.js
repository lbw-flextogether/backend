const moment = require("moment-timezone");

const timeMap = {
  "6:00 am": "6:00",
  "6:30 am": "6:30",
  "7:00 am": "7:00",
  "7:30 am": "7:30",
  "8:00 am": "8:00",
  "8:30 am": "8:30",
  "9:00 am": "9:00",
  "9:30 am": "9:30",
  "10:00 am": "10:00",
  "10:30 am": "10:30",
  "11:00 am": "11:00",
  "11:30 am": "11:30",
  "12:00 am": "12:00",
  "12:30 am": "12:30",
  "1:00 pm": "13:00",
  "1:30 pm": "13:30",
  "2:00 pm": "14:00",
  "2:30 pm": "14:30",
  "3:00 pm": "15:00",
  "3:30 pm": "15:30",
  "4:00 pm": "16:00",
  "4:30 pm": "16:30",
  "5:00 pm": "17:00",
  "5:30 pm": "17:30",
  "6:00 pm": "18:00",
  "6:30 pm": "18:30",
  "7:00 pm": "19:00",
  "7:30 pm": "19:30",
  "8:00 pm": "20:00",
  "8:30 pm": "20:30",
  "9:00 pm": "21:00",
  "9:30 pm": "21:30",
  "10:00 pm": "22:00",
  "10:30 pm": "22:30",
  "11:00 pm": "23:00"
};

/**
 * convertTimeToTimezone("11:00am", "America/New_York", "America/Los_Angeles")
 */
function convertTimeToTimezone(time, timezone, targetTimezone) {
  if (!timeMap[time]) {
    throw new Error(`Time ${time} is invalid.`);
  }
  // get today's date in string
  const dateStr = moment().format("YYYY-MM-DD");

  // create moment date object in given timezone
  const momentDate = moment.tz(`${dateStr} ${timeMap[time]}`, timezone);

  // convert to target timezone
  const targetTimezoneDate = momentDate.clone().tz(targetTimezone);

  // format to time
  return targetTimezoneDate.format("h:mm a");
}

module.exports = { convertTimeToTimezone };
