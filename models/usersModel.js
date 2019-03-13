const db = require("../data/dbConfig");

async function insert(user) {
  const [id] = await db("users").insert(user, "id");

  return await db("users")
    .where({ id })
    .first();
}

module.exports = {
  insert
};
