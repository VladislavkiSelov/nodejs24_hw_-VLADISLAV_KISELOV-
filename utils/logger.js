const colors = require("colors");
const config = require("config");
colors.enable();

const logLevel = config.logLevel;
const colorsEnabled = config.colorsEnabled;

function logger(value) {
  if (logLevel === "info") {
    return {
      info: (...arr) => {
        const validStr = +colorsEnabled ? `${value}:`.bgGreen : `${value}:`;
        console.log(validStr, ...arr);
      },
      warn: (...arr) => {
        const validStr = +colorsEnabled ? `${value}:`.bgYellow : `${value}:`;
        console.warn(validStr, ...arr);
      },
      error: (...arr) => {
        const validStr = +colorsEnabled ? `${value}:`.bgRed : `${value}:`;
        console.error(validStr, ...arr);
      },
    };
  }

  if (logLevel === "warn") {
    return {
      info: () => {},
      warn: (...arr) => {
        const validStr = +colorsEnabled ? `${value}:`.bgYellow : `${value}:`;
        console.warn(validStr, ...arr);
      },
      error: (...arr) => {
        const validStr = +colorsEnabled ? `${value}:`.bgRed : `${value}:`;
        console.error(validStr, ...arr);
      },
    };
  }

  if (logLevel === "error") {
    return {
      info: () => {},
      warn: () => {},
      error: (...arr) => {
        const validStr = +colorsEnabled ? `${value}:`.bgRed : `${value}:`;
        console.error(validStr, ...arr);
      },
    };
  }
}

module.exports = logger;
