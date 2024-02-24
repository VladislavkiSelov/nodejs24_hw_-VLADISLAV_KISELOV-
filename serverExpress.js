require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { router: routerUser } = require("./routes/routerUser");
process.env.DATA = fs.readFileSync(path.join(".", "usersJson.json"), "utf8");

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
const dataStream = fs.createWriteStream(path.join(".", "usersJson.json"), { encoding: "utf-8", highWaterMark: 1024, flags: "a" });

function customMorgan(tokens, req, res) {
  const request = [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res)].join(" ");
  console.log(request);
  return request;
}
server.use(morgan(customMorgan, { stream: accessLogStream }));

server.use("/users", routerUser);

process.on("exit", () => {
  dataStream.write(process.env.DATA);
  dataStream.end();
});

// Добавим обработку события для Ctrl+C (SIGINT) на случай прерывания процесса вручную
process.on("SIGINT", () => {
  dataStream.write(process.env.DATA);
  dataStream.end();
});
