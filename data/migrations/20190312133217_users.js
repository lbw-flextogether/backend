exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", tbl => {
    tbl.increments();

    tbl.string("name", 128).notNullable();
    tbl.string("email", 128).notNullable();
    tbl.string("phone_number", 15).notNullable();
    tbl.string("notification_preference", 128).notNullable();
    tbl.string("mobility_level", 128).notNullable();
    tbl.string("timezone", 128).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
