// dependencies
const data = require("../../lib/data");
const {
  hash,
  createRandomToken,
  parseJSON,
} = require("../../helpers/utilites");

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethod = ["post", "get", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
// another module scaffolding
handler._token = {};

handler._token.post = (requestProperties, callback) => {
  // check user phone and password
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  //  use if else
  if (phone && password) {
    // read data from file system
    data.read("users", phone, (error, userData) => {
      let hashedPassword = hash(password);
      if (hashedPassword === parseJSON(userData).password) {
        let tokenId = createRandomToken(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // save token into db
        data.create("tokens", tokenId, tokenObject, (error) => {
          if (!error) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "their was a server side problem!",
            });
          }
        });
      } else {
        callback(400, { erro: "your password is invalid" });
      }
    });
  } else {
    callback(400, { error: "your request is not valid!" });
  }
};

handler._token.get = (requestProperties, callback) => {};

handler._token.put = (requestProperties, callback) => {};

handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
