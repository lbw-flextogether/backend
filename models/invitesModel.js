const db = require("../data/dbConfig");

function inviteToJSON(invite) {
  return {
    ...invite,
    user1_availability: JSON.parse(invite.user1_availability)
  };
}

async function insert(value) {
  const updatedValue = {
    ...value,
    user1_availability: JSON.stringify(value.user1_availability)
  };

  const [id] = await db("invites").insert(updatedValue, "id");

  const invite = await db("invites")
    .where({ id })
    .first();

  return inviteToJSON(invite);
}

async function getById(id) {
  const invite = await db("invites")
    .where({ id })
    .first();
  return inviteToJSON(invite);
}

async function getUser1(id) {
  return db("invites")
    .join("users", "invites.user1_id", "users.id")
    .where("invites.id", id)
    .first();
}

async function getUser2(id) {
  return db("invites")
    .join("users", "invites.user2_id", "users.id")
    .where("invites.id", id)
    .first();
}

async function update(id, changes) {
  return db("invites")
    .where("id", id)
    .update(changes);
}

module.exports = {
  insert,
  getById,
  getUser1,
  getUser2,
  update
};
