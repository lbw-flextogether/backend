exports.up = function(knex, Promise) {
  return knex.schema.createTable("invites", tbl => {
    tbl.increments();

    tbl
      .integer("user1_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.text("user1_availability").notNullable();
    tbl.boolean("user1_is_companion").notNullable();
    tbl.boolean("user1_verified").notNullable();

    tbl
      .integer("user2_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.text("user2_availability");
    tbl.boolean("user2_is_companion").notNullable();

    tbl.string("meetup_day");
    tbl.string("meetup_time");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("invites");
};
