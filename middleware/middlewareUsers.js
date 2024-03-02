const yup = require("yup");
const knexLib = require("knex");
const knexConfig = require("../knexfile");
const knex = knexLib(knexConfig);

async function validateUserData(req, res, next) {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  const userSchema = yup.object({
    username: yup.string().required().min(2),
    email: yup.string().required().matches(emailRegex, "Invalid email format"),
  });

  try {
    await userSchema.validate(req.body);
    next();
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const [newUser] = await knex("users").insert(req.body).returning("*");
    req.newUser = newUser;
    next();
  } catch (err) {
    next(err);
  }
}

async function validateUserId(req, res, next) {
  const userSchema = yup.object({
    userId: yup.number().positive().min(0),
  });

  try {
    await userSchema.validate(req.params);
    next();
  } catch (err) {
    next(err);
  }
}

async function seachUserId(req, res, next) {
  const user = await knex.select().from("users").where({ id: req.params.userId });
  try {
    if (user.length === 0) {
      req.status = 404;
      throw new Error(`User with ID "${req.params.userId}" not found`);
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function validateUserDelete(req, res, next) {
  const userSchema = yup.object({
    userId: yup.number().positive().min(0),
  });

  try {
    await userSchema.validate(req.params);
    next();
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

function routerUserError(err, req, res, next) {
  res.status(req.status || 400).send({ error: err.message });
}

module.exports = {
  validateUserData,
  createUser,
  validateUserId,
  seachUserId,
  validateUserDelete,
  userDelete,
  routerUserError,
};
