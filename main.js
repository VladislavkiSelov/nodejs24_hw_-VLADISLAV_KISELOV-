require("dotenv").config();
const config = require("config");

const logger = require("./utils/logger")("main");

logger.info("the script is running!");

logger.warn("warn");

const error = new Error("Good to be bad", { cause: "love to break things" });

logger.error("Houston, we have a problem`", error);

const fileSync = require('./file_sync')();

fileSync.start();
