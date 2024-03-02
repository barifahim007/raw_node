const environments = {};

environments.staging = {
  port: 5000,
  envName: "staging",
};
environments.production = {
  port: 7000,
  envName: "production",
};

const currentEnvironments =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentsToExport =
  typeof environments[currentEnvironments] === "object"
    ? environments[currentEnvironments]
    : environments.staging;

module.exports = environmentsToExport;
