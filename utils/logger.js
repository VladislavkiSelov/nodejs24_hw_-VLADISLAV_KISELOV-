const colors = require("colors/safe"); // no need to pollute prototypes
const config = require("config");
const fsAsync = require("fs/promises");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const { logLevel, colorsEnabled } = config;

function checkFilesLogs() {
  try {
    const fileLogs = fs.readdirSync(".");
    if (!fileLogs.includes("logs")) {
      fs.mkdirSync(path.join(".", "logs"));
    }
  } catch (err) {
    console.error("create logs", err);
  }
}

checkFilesLogs();

const writeStreamInfo = fs.createWriteStream(path.join(".", "logs", "info.log"), { encoding: "utf-8", highWaterMark: 1024, flags: "a" });
const writeStreamError = fs.createWriteStream(path.join(".", "logs", "errors.log"), { encoding: "utf-8", highWaterMark: 1024, flags: "a" });

function logger(value) {
  const date = moment(new Date()).format("HH:mm / YY.MM.DD -");

  if (!colorsEnabled) {
    colors.disable(); // it is ON by default, so we switch it OFF when need
  }

  const loggerWeight = {
    info: 1,
    warn: 2,
    error: 3,
  };

  return {
    info: (...arr) => {
      const textMessage = `${date} ${value}: ${arr.join(" ")}\n`;
      writeStreamInfo.write(textMessage);

      if (loggerWeight[logLevel] !== loggerWeight.info) return; //! info works ONLY when 'info' level set
      console.log(colors.bgGreen(`${value}:`), ...arr);
    },
    warn: (...arr) => {
      const textMessage = `${date} ${value}: ${arr.join(" ")}\n`;
      writeStreamError.write(textMessage);

      if (loggerWeight[logLevel] > loggerWeight.warn) return; //! warn works when 'info' or 'warn' level set
      console.warn(colors.bgYellow(`${value}:`), ...arr);
    },
    error: (...arr) => {
      const textMessage = `${date} ${value}: ${arr.join(" ")}\n`;
      writeStreamError.write(textMessage);

      console.error(colors.bgRed(`${value}:`), ...arr);
    }, //! error level works ALWAYS :)
  };
}

process.on("beforeExit", () => {
  writeStreamInfo.end();
  writeStreamError.end();
});

module.exports = logger;
