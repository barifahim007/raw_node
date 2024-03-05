// dependencies
const { sampleHandler } = require("./handler/routeHandler/sampleHandler");
const { userHandler } = require("./handler/routeHandler/userHandler");
const { tokenHandler } = require("./handler/routeHandler/tokenHandler");

const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
