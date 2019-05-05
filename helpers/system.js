const cp = require('child_process');

function exec(command) {
  return new Promise((resolve, reject) => {
    cp.exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve({out: stdout, err: stderr});
      }
    });  
  });
}

module.exports = {
  exec,
};
