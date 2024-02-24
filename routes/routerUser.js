const router = require("express").Router();
const yup = require("yup");

async function validateUser(req, res, next) {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  const userSchema = yup.object({
    username: yup.string().required().min(2),
    email: yup.string().required().matches(emailRegex, "Invalid email format"),
  });

  try {
    const data = await userSchema.validate(req.body);

    const { data: dataProcess } = JSON.parse(process.env.DATA);
    process.env.DATA = JSON.stringify({ data: [...dataProcess, data] });

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
    const { userId } = await userSchema.validate(req.params);

    const { data: dataProcess } = JSON.parse(process.env.DATA);

    const user = dataProcess.find((el, i) => i === userId);

    if (!user) {
      req.status = 404;
      throw new Error(`User with ID "${userId}" not found`);
    }

    req.user = user;

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
    const { userId } = await userSchema.validate(req.params);

    const { data: dataProcess } = JSON.parse(process.env.DATA);

    if (userId in dataProcess) {
      const users = dataProcess.filter((el, i) => i !== userId);
      process.env.DATA = JSON.stringify({ data: users });
    } else {
      req.status = 404;
      throw new Error(`User with ID "${userId}" not found`);
    }

    next();
  } catch (err) {
    next(err);
  }
}

function routerError(err, req, res, next) {
  res.status(req.status || 400).send({ error: err.message });
}

router.get("/", (req, res) => {
  res.send(process.env.DATA);
});

router.get("/:userId", validateUserId, (req, res) => {
  res.send(200, req.user);
});

router.post("/", validateUser, (req, res) => {
  res.send(200);
});

router.delete("/:userId", validateUserDelete, (req, res) => {
  res.send(204);
});

router.use(routerError);

module.exports = {
  router,
};
