const router = require("express").Router();

const {
  validateUserData,
  createUser,
  validateUserId,
  seachUserId,
  validateUserDelete,
  userDelete,
  routerUserError,
} = require("../middleware/middlewareUsers");

const knexLib = require("knex");
const knexConfig = require("../knexfile");
const knex = knexLib(knexConfig);

async function giveCreateUser(req, res) {
  res.send(201, req.newUser);
}

async function giveUserId(req, res) {
  res.send(200, req.user);
}

async function giveStatusUserDelete(req, res) {
  res.send(204);
}

router.get("/", async (req, res) => {
  const allUsers = await knex.select().from("users");
  res.send(200, allUsers);
});

router.post("/", validateUserData, createUser, giveCreateUser);

router.get("/:userId", validateUserId, seachUserId, giveUserId);

router.delete("/:userId", validateUserDelete, userDelete, giveStatusUserDelete);

router.use(routerUserError);

module.exports = {
  router,
};
