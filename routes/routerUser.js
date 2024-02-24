const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { validateUserData, validateUserId, validateUserDelete, routerUserError } = require("../middleware/middlewareUsers");

/** @type { { data: { username: string, email: string, id: numer }[] } } */
let userDb = JSON.parse(fs.readFileSync(path.join(".", "usersJson.json"), "utf8"));

function createUser(req, res) {
  const newUser = {
    ...req.body,
    id: Date.now()
  };

  userDb.data.push(newUser);

  res.send(201, newUser); //! повертаємо дані збереженого юзера, разом з його айді
}

function giveUserId(req, res) {
  const user = userDb.data.find((user) => user.id === +req.params.userId);

  if (!user) {
    req.status = 404;
    throw new Error(`User with ID "${req.params.userId}" not found`);
  }

  res.send(200, user);
}

function userDelete(req, res) {
  const userId = userDb.data.findIndex((user) => user.id === +req.params.userId)

  if (userId >= 0) {
    userDb.data.splice(userId, 1);
    res.send(204);
  } else {
    req.status = 404;
    throw new Error(`User with ID "${userId}" not found`);
  }

}

router.get("/", (req, res) => {
  // давай будемо однотипними - якщо на getUserById повертаємо просто об'єкт юзера без враппера { data: ...},
  // то давай і тут так само
  res.send(200, userDb.data);
});

router.post("/", validateUserData, createUser);

router.get("/:userId", validateUserId, giveUserId);

router.delete("/:userId", validateUserDelete, userDelete);

router.use(routerUserError);

process.on("SIGINT", () => {
  fs.writeFileSync(path.join(".", "usersJson.json"), JSON.stringify(userDb));
});

module.exports = {
  router,
};
