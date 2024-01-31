const colors = require("colors");
const config = require("config");
colors.enable();
const { logLevel, colorsEnabled } = config;

function loggerInfo(value, ...arr) {
  const validStr = colorsEnabled ? `${value}:`.bgGreen : `${value}:`;
  console.log(validStr, ...arr);
}
function loggerWarn(value, ...arr) {
  const validStr = colorsEnabled ? `${value}:`.bgYellow : `${value}:`;
  console.log(validStr, ...arr);
}
function loggerError(value, ...arr) {
  const validStr = colorsEnabled ? `${value}:`.bgRed : `${value}:`;
  console.log(validStr, ...arr);
}

function logger(value) {
  return {
    info: logLevel === "info" ? (...arr) => loggerInfo(value, ...arr) : () => {},
    warn: logLevel === "warn" || logLevel === "info" ? (...arr) => loggerWarn(value, ...arr) : () => {},
    error: logLevel === "error" || logLevel === "info" || logLevel === "warn" ? (...arr) => loggerError(value, ...arr) : () => {},
  };
}

module.exports = logger;
