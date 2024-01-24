const logger = require("./utils/logger")("main");
logger.info("the script is running!");

const error = new Error('Good to be bad', { cause: 'love to break things' });
logger.error('Houston, we have a problem', error);
