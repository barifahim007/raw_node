// dependencies
const data = require("../../lib/data");
const { hash, parseJSON } = require("../../helpers/utilites");

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
    typeof requestProperties.body.tosAggrement === "boolean"
      ? requestProperties.body.tosAggrement
      : false;

  // cross check the user
  if (firstName && lastName && phone && password && tosAggrement) {
    // make sure user already exist
    data.read("users", phone, (error) => {
      // just cross check
      if (error) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAggrement,
        };
        // store data into db
        data.create("users", phone, userObject, (error) => {
          if (!error) {
            callback(200, {
              success: "user created successfully",
            });
          } else {
            callback(500, { err: "user could not created" });
          }
        });
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
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    data.read("users", phone, (err, u) => {
      const user = { ...parseJSON(u) };
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, { error: "user not found!!" });
      }
    });
  } else {
    callback(404, { error: "user not found!!" });
  }
};

handler._users.put = (requestProperties, callback) => {
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
    typeof requestProperties.body.tosAggrement === "boolean"
      ? requestProperties.body.tosAggrement
      : false;

  // checking the user

  if (phone) {
    if (firstName || lastName || password) {
      //  read the data from file system
      data.read("users", phone, (error, uData) => {
        // parse into valid js object
        const userData = { ...parseJSON(uData) };

        if (!error && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }
          // store data into db
          data.update("users", phone, userData, (error) => {
            if (!error) {
              callback(200, {
                succes: "user updated successfully!",
              });
            } else {
              callback(500, {
                error: "there was a problem in the server side!",
              });
            }
          });
        } else {
          callback(400, {
            error: "you have a problem in your request!",
          });
        }
      });
    } else {
      callback(400, {
        error: "your have a problem in your request ",
      });
    }
  } else {
    callback(400, {
      error: "your phone number is invalid",
    });
  }
};

handler._users.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    data.read("users", phone, (error, userData) => {
      if (!error && userData) {
        // delete the user
        data.delete("users", phone, (error) => {
          if (!error) {
            callback(200, {
              success: "user deleted successfully",
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
      error: "you have a problem in your request && invalid phone number ",
    });
  }
};

module.exports = handler;
