const fs = require('fs');

function createDir(dirname) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirname, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });  
}

function writeFile(filename, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, content, err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }  
    })
  });
}

module.exports = {
  createDir,
  writeFile,
};
