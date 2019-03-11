const db = require("../data/dbConfig");

async function insert(value) {
  const updatedValue = {
    ...value,
    availability: JSON.stringify(value.availability)
  };

  const [id] = await db("invites").insert(updatedValue);

  const invite = await db("invites")
    .where({ id })
    .first();

  return {
    ...invite,
    availability: JSON.parse(invite.availability)
  };
}

module.exports = {
  insert
};
