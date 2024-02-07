const colors = require('colors/safe'); // no need to pollute prototypes
const config = require('config');

const { logLevel, colorsEnabled } = config;

function logger(value) {
  if (!colorsEnabled) {
    colors.disable(); // it is ON by default, so we switch it OFF when need
  }

  const loggerWeight = {
    info: 1,
    warn: 2,
    error: 3
  }

  return {
    info: (...arr) => {
      if (loggerWeight[logLevel] !== loggerWeight.info) return; //! info works ONLY when 'info' level set
      console.log(colors.bgGreen(`${value}:`), ...arr)
    },
    warn: (...arr) => {
      if (loggerWeight[logLevel] > loggerWeight.warn) return; //! warn works when 'info' or 'warn' level set
      console.warn(colors.bgYellow(`${value}:`), ...arr)
    },
    error: (...arr) => console.error(colors.bgRed(`${value}:`), ...arr) //! error level works ALWAYS :)
  };
}

module.exports = logger;