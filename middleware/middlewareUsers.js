const yup = require("yup");

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

function routerUserError(err, req, res, next) {
    res.status(req.status || 400).send({ error: err.message });
  }

module.exports = {
  validateUserData,
  validateUserId,
  validateUserDelete,
  routerUserError
};
