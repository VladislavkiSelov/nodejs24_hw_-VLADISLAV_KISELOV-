const knexLib = require("knex");
const knexConfig = require("../knexfile");
const knex = knexLib(knexConfig);

async function getAllUsers(req, res, next) {
  try {
    const allUsers = await knex.select().from("users");
    req._data = allUsers;
    next()
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const [newUser] = await knex("users").insert(req.body).returning("*");
    req._data = newUser;
    next();
  } catch (err) {
    next(err);
  }
}

async function searchUserId(req, res, next) {
  const user = await knex.select().from("users").where({ id: req.params.userId }).first();
  try {
    if (!user) {
      req.status = 404;
      throw new Error(`User with ID "${req.params.userId}" not found`);
    } else {
      req._data = user;
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function userDelete(req, res, next) {
  const result = await knex.delete().from("users").where({ id: req.params.userId });

  try {
    if (!result) {
      req.status = 404;
      throw new Error(`User with ID "${req.params.userId}" not found`);
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers,
  createUser,
  searchUserId,
  userDelete,
};
