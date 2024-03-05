// dependencies
const data = require("../../lib/data");
const {
  hash,
  createRandomString,
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
  if (phone && password) {
    data.read("users", phone, (err1, userData) => {
      const hashedpassword = hash(password);
      if (hashedpassword === parseJSON(userData).password) {
        const tokenId = createRandomString(20);
        const expires = Date.now() + 60 * 60 * 1000;
        const tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // store the token
        data.create("tokens", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "There was a problem in the server side!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not valid!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        const token = { ...parseJSON(tokenData) };
        callback(200, token);
      } else {
        callback(404, { error: "Token is not found!" });
      }
    });
  } else {
    callback(404, { error: "Your request is not valid!" });
  }
};

handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true;

  if (id && extend) {
    data.read("tokens", id, (error, tokenData) => {
      if (!error) {
        const tokenObject = parseJSON(tokenData);
        if (tokenObject.expires > Date.now()) {
          tokenObject.expires = Date.now() + 60 * 60 * 1000;
          // update data
          data.update("tokens", id, tokenObject, (err) => {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                error: "There was a server side error",
              });
            }
          });
        } else {
          callback(400, {
            error: "Token is expired",
          });
        }
      } else {
        callback(400, {
          error: "Token not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "Your token is not valid",
    });
  }
};

handler._token.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("tokens", id, (error, userData) => {
      if (!error && userData) {
        // delete the user
        data.delete("tokens", id, (error) => {
          if (!error) {
            callback(200, {
              success: "token deleted successfully",
            });
          } else {
            callback(500, {
              error: "their was a server side error",
            });
          }
        });
      } else {
        callback(500, {
          error: "thier was a serverside error",
        });
      }
    });
  } else {
    callback(400, {
      error: "opps! your token is invalid ",
    });
  }
};

module.exports = handler;
