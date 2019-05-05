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

function readJSON(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([]);
        } else {
          console.log(err);
          reject(err);  
        }
      } else {
        resolve(JSON.parse(data));
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

function writeJSON(filename, content) {
  return writeFile(filename, JSON.stringify(content));
}

module.exports = {
  createDir,
  readJSON,
  writeFile,
  writeJSON,
};
