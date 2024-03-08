// dependencies
const server = require("./lib/server");
const worker = require("./lib/worker");

// app object-module scaffolding
const app = {};

// call the app function

app.init = () => {
  // start the server
  server.init();

  //  start the worker
  worker.init();
};

app.init();

//  exports app
module.exports = app;
