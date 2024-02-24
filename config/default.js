const logLevel = process.env.LOG_LEVEL || "warn";
const colorsEnabled = process.env.COLORS_ENABLED === "1"

module.exports = {
  logLevel,
  colorsEnabled,
};
