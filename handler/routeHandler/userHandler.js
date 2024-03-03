// dependencies
const data = require("../../lib/data");

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethod = ["post", "get", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
// another module scaffolding
handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
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
  const tosAggrement =
    typeof requestProperties.body.tosAggrement === "boolean" &&
    requestProperties.body.tosAggrement.trim().length > 0
      ? requestProperties.body.tosAggrement
      : false;

  // cross check the user
  if (firstName && lastName && phone && password && tosAggrement) {
    // make sure user already exist
    data.read("users", "phone", (error, user) => {
      // just cross check
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password,
          tosAggrement,
        };
      } else {
        callback(500, {
          error: "there is a server side problem",
        });
      }
    });
  } else {
    callback(400, {
      error: "you have a problem in your request",
    });
  }
};

handler._users.get = (requestProperties, callback) => {
  callback(200);
};

handler._users.put = (requestProperties, callback) => {};

handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
