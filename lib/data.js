// dependencies

const fs = require("fs");
const path = require("path");

// module scaffolding
const lib = {};

// handle baseDirectory
lib.basedir = path.join(__dirname, "../.data/");

// write the file

lib.create = (dir, file, data, callback) => {
  // opening the file
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert the data
      const stringData = JSON.stringify(data);
      // write the file
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          // closing the file after write
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback(`Error! closing the new file`);
            }
          });
        } else {
          callback(`Error! writing two the file`);
        }
      });
    } else {
      callback(`Error! could not create new file ! it may file already exists`);
    }
  });
};

//  read the file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

// update the data
lib.update = (dir, file, data, callback) => {
  //   open the file
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert the string data
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (error) => {
        if (!error) {
          fs.writeFile(fileDescriptor, stringData, (error) => {
            if (!error) {
              fs.close(fileDescriptor, (error) => {
                if (!error) {
                  callback(false);
                } else {
                  callback(`Error! closing the file`);
                }
              });
            } else {
              callback(`file does not write`);
            }
          });
        } else {
          callback(`file does not truncate `);
        }
      });
    } else {
      callback(`file does not exists`);
    }
  });
};

// delete or unlink the file

lib.delete = (dir, file, callback) => {
  //   unlink the file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(`file can not delete`);
    }
  });
};

// lsit of all file names

lib.listFile = (dir, callback) => {
  fs.readdir(`${lib.basedir + dir}/`, (error, fileNames) => {
    if (!error && fileNames && fileNames.length > 0) {
      const trimmmedFileName = [];

      //looping the file name
      fileNames.forEach((fileName) => {
        trimmmedFileName.push(fileName.replace(".josn", ""));
      });
      callback(false, trimmmedFileName);
    } else {
      callback(`file name is not found!!!`);
    }
  });
};

module.exports = lib;
