exports.seed = function(knex, Promise) {
  return knex("users")
    .del()
    .then(function() {
      return knex("users").insert([
        {
          name: "Elda Palumbo",
          email: "elda_fake@gmail.com",
          phone_number: "888-888-8888",
          notification_preference: "Email",
          mobility_level: "Medium",
          timezone: "America/New_York"
        },
        {
          name: "Pacifico Giordano",
          email: "pacifico_fake@gmail.com",
          phone_number: "999-999-9999",
          notification_preference: "Email",
          mobility_level: "High",
          timezone: "America/New_York"
        }
      ]);
    });
};
