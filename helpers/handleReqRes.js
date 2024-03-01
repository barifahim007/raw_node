// dependencies
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const routes = require("../routes");
const { notFoundHandler } = require("../handler/routeHandler/notFoundHandler");

// module scaffolding
const handler = {};

// hanler body
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

  const choosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  choosenHandler(parsedProperties, (statusCode, payload) => {
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    payload = typeof payload === "object" ? payload : {};

    // use json  stringify method

    const payloadString = JSON.stringify(payload);

    // finally send response to the client
    res.writeHead(statusCode);
    res.end(payloadString);
  });

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on("end", (buffer) => {
    realData += decoder.end(buffer);
    console.log(realData);
    // handle response
    res.end("hello programmers World");
  });
};

// export handler as module
module.exports = handler;
