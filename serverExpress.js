require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { router: routerUser } = require("./routes/routerUser");

const server = express();

server.listen(3000);

const jsonBodyParser = express.json();

server.use(jsonBodyParser);

function checkLogFile() {
  if (!fs.existsSync(path.join(".", "infoServerExpress.log"))) {
    fs.writeFileSync(path.join(".", "infoServerExpress.log"), "");
  }
}

checkLogFile();

const accessLogStream = fs.createWriteStream(path.join(".", "infoServerExpress.log"), { flags: "a" });

function customMorgan(tokens, req, res) {
  const request = [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res)].join(" ");
  console.log(request);
  return request;
}
server.use(morgan(customMorgan, { stream: accessLogStream }));

server.use("/users", routerUser);
