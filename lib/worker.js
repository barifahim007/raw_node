// dependencies
const url = require("url");
const http = require("http");
const https = require("https");
const data = require("./data");

const { parseJSON } = require("../helpers/utilites");
const { sendTwilioSms } = require("../helpers/notifications");

// app object-module scaffolding
const worker = {};

//  lookups all the checks
worker.geatherAllChecks = () => {
  //check the list
  data.listFile("checks", (error, checks) => {
    // if else
    if (!error && checks && checks.length > 0) {
      checks.forEach((check) => {
        data.read("checks", check, (error, originalCheckData) => {
          if (!error && originalCheckData) {
            const checkData = parseJSON(originalCheckData);

            //  verifing the checksData and its separeate function that was wrriten outside!
            worker.ValidateCheckData(checkData);
          } else {
            console.log(`Error: there was no file to iterate!!!!!!!!`);
          }
        });
      });
    } else {
      console.log(`Error: could not find any checks to process`);
    }
  });
};

// validate individual check data
worker.ValidateCheckData = (checkData) => {
  const originalCheckData = checkData;

  if (originalCheckData && originalCheckData.id) {
    // verifing once more time
    originalCheckData.state =
      typeof originalCheckData.state === "string" &&
      ["up", "down"].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : "down";

    originalCheckData.lastChecked =
      typeof originalCheckData.lastChecked === "number" &&
      originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    // send to the another function
    worker.perfomedCheck(originalCheckData);
  } else {
    console.log(`Error: check was invalid!!!!!!!!`);
  }
};

// check the perforamance of check data function
worker.perfomedCheck = (originalCheckData) => {
  // prepeared the check outCome
  let checkoutCome = {
    error: false,
    ResponseCode: false,
  };
  // mark the outcome not sent yet
  let outComeSent = false;

  const parsedUrl = url.parse(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
    true
  );
  const hostName = parsedUrl.hostname;
  const { path } = parsedUrl;

  // constructor object
  const requestDetails = {
    protcol: `${originalCheckData.protcol}`,
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000,
  };

  const protocolToUse = originalCheckData.protcol === "http" ? http : https;

  let req = protocolToUse.request(requestDetails, (res) => {
    const status = res.statusCode;

    checkoutCome.ResponseCode = status;
    //  if else
    if (!outComeSent) {
      worker.processCheckOutCome(originalCheckData, protocolToUse);
      outComeSent = true;
    }
  });

  req.on("error", (e) => {
    checkoutCome = {
      error: true,
      value: e,
    };

    //  if else
    if (!outComeSent) {
      worker.processCheckOutCome(originalCheckData, protocolToUse);
      outComeSent = true;
    }
  });
  req.on("timeout", () => {
    checkoutCome = {
      error: true,
      value: "timeout",
    };
    //  if else
    if (!outComeSent) {
      worker.processCheckOutCome(originalCheckData, protocolToUse);
      outComeSent = true;
    }
  });

  // end request
  req.end();
};

// process check outCome

worker.processCheckOutCome = (originalCheckData, protocolToUse) => {
  let state =
    !checkoutCome.error &&
    checkoutCome.ResponseCode &&
    originalCheckData.successCodes.indexOf(checkoutCome.ResponseCode) > -1
      ? "up"
      : "down";

  let alertWanted =
    originalCheckData.lastChecked && originalCheckData.state !== state
      ? true
      : false;

  //update the checkdata
  let newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  // update chekdata to db

  data.update("checks", newCheckData.id, newCheckData, (error) => {
    if (!error) {
      if (alertWanted) {
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log(`Alert : is not need as there any change the state`);
      }
    } else {
      console.log("Error: trying to save check data is failed!!!!");
    }
  });
};

//  alert the user using twilo appi
worker.alertUserToStatusChange = (newCheckData) => {
  let msg = `Alert your check for ${newCheckData.method.toUpperCase()} &&  ${
    newCheckData.protocol
  }://${newCheckData.url} is currentlly ${newCheckData.state}`;

  // sending sms using twilo

  sendTwilioSms(newCheckData.userPhone, msg, (error) => {
    if (!error) {
      console.log(
        `your requested status code has been changed && currently status code is: ${msg}`
      );
    } else {
      console.log(`there was a problem sending sms to the user!!!`);
    }
  });
};

// the loop events
worker.loop = () => {
  setInterval(() => {
    worker.geatherAllChecks();
  }, 10000);
};

//  start the server
worker.init = () => {
  // check all users
  worker.geatherAllChecks();

  // loop the checks events
  worker.loop();
};

// exports server
module.exports = worker;
