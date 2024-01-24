function logger(value) {
  return {
    info: (...arr) => console.log(`${value}:`, ...arr),
    warn: (...arr) => console.warn(`${value}:`, ...arr),
    error: (...arr) => console.error(`${value}:`, ...arr),
  };
}

module.exports = logger;
