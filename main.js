require("dotenv").config();

const loggerFile = require("./utils/logger");

const { createLogger, writeStreamInfo, writeStreamError } = loggerFile;

const logger = createLogger("main");

logger.info("the script is running!");

logger.warn("warn");

const error = new Error("Good to be bad", { cause: "love to break things" });

logger.error("Houston, we have a problem`", error);

const fileSync = require("./file_sync");

fileSync.start();

process.on("beforeExit", () => {
  writeStreamInfo.end();
  writeStreamError.end();
});
