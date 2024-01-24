function logger(value) {
  return {
    info: (str) => console.log(`${value}: ${str}`),
    warn: (str) => console.warn(`${value}: ${str}`),
    error: (str) => console.error(`${value}: ${str}`),
  };
}

module.exports = logger;
