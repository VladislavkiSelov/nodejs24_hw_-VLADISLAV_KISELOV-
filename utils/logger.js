const colors = require('colors/safe'); // no need to pollute prototypes
const config = require('config');

const { logLevel, colorsEnabled } = config;

function logger(value) {
  if (!colorsEnabled) {
    colors.disable(); // it is ON by default, so we switch it OFF when need
  }

  return {
    info: (...arr) => console.log(colors.bgGreen(`${value}:`), ...arr),
    warn: (...arr) => console.warn(colors.bgYellow(`${value}:`), ...arr),
    error: (...arr) => console.error(colors.bgRed(`${value}:`), ...arr)
  };
}

module.exports = logger;
