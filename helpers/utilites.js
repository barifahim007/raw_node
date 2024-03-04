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

module.exports = utilities;
