const router = require("express").Router();

const { validateUserData, validateUserId } = require("../middleware/users");
const { createUser, seachUserId, userDelete, getAllUsers } = require("../service/users");


function responsSuccessStatusOnly(req, res) {
  res.send(204);
}

function respondSuccessWithData(status = 200) {
  return (req, res) => res.send(status, req._data);
}

function routerUserError(err, req, res, next) {
  res.status(req.status || 400).send({ error: err.message });
}

router.get("/", getAllUsers, respondSuccessWithData());

router.post("/", validateUserData, createUser, respondSuccessWithData(201));

router.get("/:userId", validateUserId, seachUserId, respondSuccessWithData());

router.delete("/:userId", validateUserId, userDelete, responsSuccessStatusOnly);

router.use(routerUserError);

module.exports = {
  router,
};
