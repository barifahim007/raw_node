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
// create random string
utilities.createRandomString = (strlength) => {
  // Check if strlength is a valid number greater than 0
  let length = strlength;
  length = typeof strlength === "number" && strlength > 0 ? strlength : false;

  if (length) {
    // Define the possible characters for the string
    const possiblecharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    // Loop through to generate the string
    for (let i = 1; i <= length; i += 1) {
      // Select a random character from possiblecharacters
      const randomCharacter = possiblecharacters.charAt(
        Math.floor(Math.random() * possiblecharacters.length)
      );
      // Append the random character to the output
      output += randomCharacter;
    }
    return output; // Return the generated string
  }
  return false; // Return false if the input length is not valid
};

module.exports = utilities;
