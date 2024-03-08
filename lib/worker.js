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

// ? sumit dada

// /*
//  * Title: Workers library
//  * Description: Worker related files
//  * Author: Sumit Saha ( Learn with Sumit )
//  * Date: 12/27/2020
//  *
//  */
// // dependencies
// const url = require("url");
// const http = require("http");
// const https = require("https");
// const data = require("./data");
// const { parseJSON } = require("../helpers/utilites");
// const { sendTwilioSms } = require("../helpers/notifications");

// // worker object - module scaffolding
// const worker = {};

// // lookup all the checks
// worker.gatherAllChecks = () => {
//   // get all the checks
//   data.listFile("checks", (err1, checks) => {
//     if (!err1 && checks && checks.length > 0) {
//       checks.forEach((check) => {
//         // read the checkData
//         data.read("checks", check, (err2, originalCheckData) => {
//           if (!err2 && originalCheckData) {
//             // pass the data to the check validator
//             worker.validateCheckData(parseJSON(originalCheckData));
//           } else {
//             console.log("Error: reading one of the checks data!");
//           }
//         });
//       });
//     } else {
//       console.log("Error: could not find any checks to process!");
//     }
//   });
// };

// // validate individual check data
// worker.validateCheckData = (originalCheckData) => {
//   const originalData = originalCheckData;
//   if (originalCheckData && originalCheckData.id) {
//     originalData.state =
//       typeof originalCheckData.state === "string" &&
//       ["up", "down"].indexOf(originalCheckData.state) > -1
//         ? originalCheckData.state
//         : "down";

//     originalData.lastChecked =
//       typeof originalCheckData.lastChecked === "number" &&
//       originalCheckData.lastChecked > 0
//         ? originalCheckData.lastChecked
//         : false;

//     // pass to the next process
//     worker.performCheck(originalData);
//   } else {
//     console.log("Error: check was invalid or not properly formatted!");
//   }
// };

// // perform check
// worker.performCheck = (originalCheckData) => {
//   // prepare the initial check outcome
//   let checkOutCome = {
//     error: false,
//     responseCode: false,
//   };
//   // mark the outcome has not been sent yet
//   let outcomeSent = false;

//   // parse the hostname & full url from original data
//   const parsedUrl = url.parse(
//     `${originalCheckData.protocol}://${originalCheckData.url}`,
//     true
//   );
//   const hostName = parsedUrl.hostname;
//   const { path } = parsedUrl;

//   // construct the request
//   const requestDetails = {
//     protocol: `${originalCheckData.protocol}:`,
//     hostname: hostName,
//     method: originalCheckData.method.toUpperCase(),
//     path,
//     timeout: originalCheckData.timeoutSeconds * 1000,
//   };

//   const protocolToUse = originalCheckData.protocol === "http" ? http : https;

//   const req = protocolToUse.request(requestDetails, (res) => {
//     // grab the status of the response
//     const status = res.statusCode;
//     // update the check outcome and pass to the next process
//     checkOutCome.responseCode = status;
//     if (!outcomeSent) {
//       worker.processCheckOutcome(originalCheckData, checkOutCome);
//       outcomeSent = true;
//     }
//   });

//   req.on("error", (e) => {
//     checkOutCome = {
//       error: true,
//       value: e,
//     };
//     // update the check outcome and pass to the next process
//     if (!outcomeSent) {
//       worker.processCheckOutcome(originalCheckData, checkOutCome);
//       outcomeSent = true;
//     }
//   });

//   req.on("timeout", () => {
//     checkOutCome = {
//       error: true,
//       value: "timeout",
//     };
//     // update the check outcome and pass to the next process
//     if (!outcomeSent) {
//       worker.processCheckOutcome(originalCheckData, checkOutCome);
//       outcomeSent = true;
//     }
//   });

//   // req send
//   req.end();
// };

// // save check outcome to database and send to next process
// worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
//   // check if check outcome is up or down
//   const state =
//     !checkOutCome.error &&
//     checkOutCome.responseCode &&
//     originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
//       ? "up"
//       : "down";

//   // decide whether we should alert the user or not
//   const alertWanted = !!(
//     originalCheckData.lastChecked && originalCheckData.state !== state
//   );

//   // update the check data
//   const newCheckData = originalCheckData;

//   newCheckData.state = state;
//   newCheckData.lastChecked = Date.now();

//   // update the check to disk
//   data.update("checks", newCheckData.id, newCheckData, (err) => {
//     if (!err) {
//       if (alertWanted) {
//         // send the checkdata to next process
//         worker.alertUserToStatusChange(newCheckData);
//       } else {
//         console.log("Alert is not needed as there is no state change!");
//       }
//     } else {
//       console.log("Error trying to save check data of one of the checks!");
//     }
//   });
// };

// // send notification sms to user if state changes
// worker.alertUserToStatusChange = (newCheckData) => {
//   const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
//     newCheckData.protocol
//   }://${newCheckData.url} is currently ${newCheckData.state}`;

//   sendTwilioSms(newCheckData.userPhone, msg, (err) => {
//     if (!err) {
//       console.log(`User was alerted to a status change via SMS: ${msg}`);
//     } else {
//       console.log("There was a problem sending sms to one of the user!");
//     }
//   });
// };

// // timer to execute the worker process once per minute
// worker.loop = () => {
//   setInterval(() => {
//     worker.gatherAllChecks();
//   }, 5000);
// };

// // start the workers
// worker.init = () => {
//   // execute all the checks
//   worker.gatherAllChecks();

//   // call the loop so that checks continue
//   worker.loop();
// };

// // export
// module.exports = worker;
