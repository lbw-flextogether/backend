exports.seed = function(knex, Promise) {
  return knex("invites")
    .truncate()
    .then(function() {
      return knex("invites").insert([
        {
          name: "Bhumi",
          email: "bhumi_fake@gmail.com",
          phone_number: "888-888-8888",
          notification_preference: "Text & Email",
          mobility_level: "Medium",
          time_zone: "Los Angles(Pacific Standard Time)",
          availability: JSON.stringify([
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
          recipient_name: "buddy",
          recipient_email: "buddy_fake@gmail.com",
          recipient_phone_number: "800-800-8000",
          recipient_mobility_level: "High"
        }
      ]);
    });
};
