exports.up = function(knex, Promise) {
  return knex.schema.createTable("invites", tbl => {
    tbl.increments();

    tbl.string("name", 128).notNullable();
    tbl.string("email", 128).notNullable();
    tbl.string("phone_number", 15).notNullable();
    tbl.string("notification_preference", 128).notNullable();
    tbl.string("mobility_level", 128).notNullable();
    tbl.string("time_zone", 128).notNullable();
    tbl.text("availability").notNullable();

    tbl.string("recipient_name", 128).notNullable();
    tbl.string("recipient_email", 128).notNullable();
    tbl.string("recipient_phone_number", 15).notNullable();
    tbl.string("recipient_mobility_level", 128).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("invites");
};
