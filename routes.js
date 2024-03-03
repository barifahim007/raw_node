// dependencies
const { sampleHandler } = require("./handler/routeHandler/sampleHandler");
const { userHandler } = require("./handler/routeHandler/userHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
