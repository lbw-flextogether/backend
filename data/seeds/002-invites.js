exports.seed = function(knex, Promise) {
  return knex("invites")
    .truncate()
    .then(function() {
      return knex("invites").insert([
        {
          user1_id: 1,
          user1_availability: JSON.stringify([
            {
              day: "Monday",
              time_slots: ["7:00 am", "8:00 am"]
            },
            {
              day: "Friday",
              time_slots: ["7:30 am", "8:00 am", "8:30 am"]
            },
            {
              day: "Saturday",
              time_slots: ["4:30 pm", "5:00 pm", "6:30 pm"]
            }
          ]),
          user1_is_companion: false,
          user1_verified: true,
          user2_id: 2,
          user2_availability: JSON.stringify([
            {
              day: "Friday",
              time_slots: ["7:30 am", "8:00 am", "8:30 am"]
            }
          ]),
          user2_is_companion: true,
          meetup_day: "Friday",
          meetup_timeslot: "8:00 am"
        }
      ]);
    });
};
