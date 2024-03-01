const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  console.log(requestProperties);
  callback(200, {
    message: "just a sample handle routes",
  });
};

module.exports = handler;
