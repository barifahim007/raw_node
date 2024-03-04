const environments = {};

environments.staging = {
  port: 5000,
  envName: "staging",
  secret: "kdkdkfhf",
};
environments.production = {
  port: 7000,
  envName: "production",
  secret: "djdthgk",
};

const currentEnvironments =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentsToExport =
  typeof environments[currentEnvironments] === "object"
    ? environments[currentEnvironments]
    : environments.staging;

module.exports = environmentsToExport;
