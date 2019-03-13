const db = require("../data/dbConfig");

async function insert(user) {
  const [id] = await db("users").insert(user, "id");

  return await db("users")
    .where({ id })
    .first();
}

async function getById(id) {
  return await db("users")
    .where({ id })
    .first();
}

async function update(id, changes) {
  return db("users")
    .where("id", id)
    .update(changes);
}

module.exports = {
  insert,
  getById,
  update
};
