/*
 * Project: uptime monitoring api
 * Description: a uptime monitoring api that check the active links
 * Authore: fahim007
 * Date: 01/03.2024
 */

// dependencies
const http = require("node:http");
const { handleReqRes } = require("./helpers/handleReqRes");
// app object-module scaffolding
const app = {};

// configuration
app.config = {
  port: 5000,
};

//  create server - take an function
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`the server is runing in ${app.config.port}`);
  });
};

// handle request and response
app.handleReqRes = handleReqRes;
//  start the server
app.createServer();
