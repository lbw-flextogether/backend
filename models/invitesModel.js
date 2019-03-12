const db = require("../data/dbConfig");

async function inviteToJSON(invite) {
  return {
    ...invite,
    availability: JSON.parse(invite.availability)
  };
}

async function insert(value) {
  const updatedValue = {
    ...value,
    availability: JSON.stringify(value.availability)
  };

  const [id] = await db("invites").insert(updatedValue);

  const invite = await db("invites")
    .where({ id })
    .first();

  return inviteToJSON(invite);
}

async function getByToken(token) {
  const invite = await db("invites").first();
  return inviteToJSON(invite);
}

module.exports = {
  insert,
  getByToken
};
