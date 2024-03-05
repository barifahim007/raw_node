const crypto = require("node:crypto");
const environments = require("../helpers/evniroments.js");

const utilities = {};

utilities.parseJSON = (stringJson) => {
  let output;
  try {
    output = JSON.parse(stringJson);
  } catch {
    output = {};
  }
  return output;
};
// hassing password
utilities.hash = (stringHash) => {
  if (typeof stringHash === "string" && stringHash.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secret)
      .update(stringHash)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};
// compare password and hashed
utilities.createRandomToken = (stringLength) => {
  let stringToken = stringLength;
  stringToken =
    typeof stringLength === "number" && stringLength > 0 ? stringLength : false;

  if (stringToken) {
    let possibleCharecters = "abcdefghijklmnopqrstwxyz1234567890";

    let output = "";
    // loop the variables
    for (let i = 1; i < stringToken; i++) {
      const randomCharecter = possibleCharecters.charAt(
        Math.floor(Math.random() * possibleCharecters.length)
      );
      output += randomCharecter;
    }
    return output;
  } else {
    return false;
  }
};

module.exports = utilities;
