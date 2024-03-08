const environments = {};

environments.staging = {
  port: 5000,
  envName: "staging",
  secret: "kdkdkfhf",
  maxCheckes: 5,
  twilio: {
    fromTwilio: "+15017122661",
    accountSid: "AC203255b3aa6e1be84e71416f4c52d530",
    authToken: "e1e5f64b59d074988aa69dc29b6af362",
  },
};
environments.production = {
  port: 7000,
  envName: "production",
  secret: "djdthgk",
  maxCheckes: 5,
  twilio: {
    fromTwilio: "+15017122661",
    accountSid: "AC203255b3aa6e1be84e71416f4c52d530",
    authToken: "e1e5f64b59d074988aa69dc29b6af362",
  },
};

const currentEnvironments =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const environmentsToExport =
  typeof environments[currentEnvironments] === "object"
    ? environments[currentEnvironments]
    : environments.staging;

module.exports = environmentsToExport;
