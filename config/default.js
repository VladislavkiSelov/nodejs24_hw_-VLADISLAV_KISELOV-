const logLevel = !process.env.LOG_LEVEL ? "warn" : process.env.LOG_LEVEL;
const getColorsEnabled = !process.env.COLORS_ENABLED ? 0 : process.env.COLORS_ENABLED;
const colorsEnabled = getColorsEnabled === '1';

module.exports = {
  logLevel,
  colorsEnabled,
};
