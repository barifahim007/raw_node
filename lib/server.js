/*
 * Project: uptime monitoring api
 * Description: a uptime monitoring api that check the active links
 * Authore: fahim007
 * Date: 01/03.2024
 */

// dependencies
const http = require("node:http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environments = require("../helpers/evniroments");

// app object-module scaffolding
const server = {};

//  create server - take an function
server.createServer = () => {
  const serverCreate = http.createServer(server.handleReqRes);
  serverCreate.listen(environments.port, () => {
    console.log(`the server is runing in ${environments.port}`);
  });
};

// handle request and response
server.handleReqRes = handleReqRes;
//  start the server
server.init = () => {
  server.createServer();
};

// exports server
module.exports = server;
