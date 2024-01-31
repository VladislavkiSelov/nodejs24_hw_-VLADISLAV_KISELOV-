const logLevel = !process.env.LOG_LEVEL ? "warn" : process.env.LOG_LEVEL;
const colorsEnabled = !process.env.COLORS_ENABLED ? 0 : process.env.COLORS_ENABLED;

module.exports = {
  logLevel,
  colorsEnabled,
};
