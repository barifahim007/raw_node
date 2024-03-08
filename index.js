/*
 * Project: uptime monitoring api
 * Description: a uptime monitoring api that check the active links
 * Authore: fahim007
 * Date: 01/03.2024
 */

// dependencies
const http = require("node:http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environments = require("./helpers/evniroments");
const data = require("./lib/data");
const { sendTwilioSms } = require("./helpers/notifications");

// app object-module scaffolding
const app = {};

//  @twiloo sms
sendTwilioSms("01735789091", "hey twlio brozz", (error) => {
  console.log(`this is twlior borz ${error}`);
});
//  create server - take an function
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environments.port, () => {
    console.log(`the server is runing in ${environments.port}`);
  });
};

// handle request and response
app.handleReqRes = handleReqRes;
//  start the server
app.createServer();
