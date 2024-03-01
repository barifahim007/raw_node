// app scaffolder
const handler = {};

handler.notFoundHandler = (parsedProperties, callback) => {
  callback(404, {
    message: "your requested url is invalid. ",
  });
};

module.exports = handler;
