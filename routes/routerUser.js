const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { validateUserData, validateUserId, validateUserDelete, routerUserError } = require("../middleware/middlewareUsers");
let data = JSON.parse(fs.readFileSync(path.join(".", "usersJson.json"), "utf8"));

function createUser(req, res) {
  newData = { data: [...data.data, req.body] };
  data = newData;

  res.send(201, req.body);
}

function giveUserId(req, res) {
  const user = data.data.find((el, i) => i === +req.params.userId);

  if (!user) {
    req.status = 404;
    throw new Error(`User with ID "${req.params.userId}" not found`);
  }

  res.send(200, user);
}

function userDelete(req, res) {
  const userId = req.params.userId;
  if (+userId in data.data) {
    const users = data.data.filter((el, i) => i !== +userId);
    data = { data: users };
  } else {
    req.status = 404;
    throw new Error(`User with ID "${userId}" not found`);
  }

  res.send(204);
}

router.get("/", (req, res) => {
  res.send(200, data);
});

router.post("/", validateUserData, createUser);

router.get("/:userId", validateUserId, giveUserId);

router.delete("/:userId", validateUserDelete, userDelete);

router.use(routerUserError);

process.on("SIGINT", () => {
  fs.writeFileSync(path.join(".", "usersJson.json"), JSON.stringify(data));
});

module.exports = {
  router,
};
