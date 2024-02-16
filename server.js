const logger = require("./utils/logger")("server");

const http = require("http");

const server = http.createServer();

const port = 3000;

server.listen(port);

server.on("listening", () => console.log(`server start port-[${port}]`));

server.on("request", (req, res) => {
  if (req.url !== `/healthcheck`) {
    res.writeHead(404, `Not Found`);
    logger.warn(`${req.method}${req.url}404`);
    res.end();
    return;
  }

  if (req.method !== "GET") {
    res.writeHead(404, `Not Found`);
    logger.warn(`${req.method}${req.url}404`);
    res.end();
    return;
  }

  res.writeHead(200, `OK`);
  res.write("healthcheck passed");
  logger.info(`${req.method}${req.url}200`);
  res.end();
});
