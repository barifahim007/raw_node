// dependencies
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const routes = require("../routes");
const { notFoundHandler } = require("../handler/routeHandler/notFoundHandler");
const { parseJSON } = require("../helpers/utilites");
// module scaffolding
const handler = {};

// handler body
handler.handleReqRes = (req, res) => {
  // handle request
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;
  const headerObject = req.headers;

  const parsedProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headerObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on("end", () => {
    realData += decoder.end();
    // sending data into body
    parsedProperties.body = parseJSON(realData);
    // get request
    chosenHandler(parsedProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      // use json stringify method

      const payloadString = JSON.stringify(payload);

      // finally send response to the client
      res.setHeader("content-type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

// export handler as module
module.exports = handler;
