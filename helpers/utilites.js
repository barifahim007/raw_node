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

module.exports = utilities;
