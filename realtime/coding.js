const debug = require('debug')('fragticquewm:koding');
const fileHelper = require('../helpers/file');
const sysHelper = require('../helpers/system');
const langConfig = require('../lang.json');

function codingRealtime(socket) {
  debug('Terhubung ke Koding');
  socket.on('bahasa', (bahasa, code) => {
    debug('Kodingan Berhasil Terkirim');
    const dirname = `source/${Math.random()}`;
    const language = langConfig[bahasa];
  
    const filename = `${dirname}/${language.file}`;
    const needCompile = language.compile;
    const compileScript = needCompile && needCompile.replace(/<<@dirname>>/g, dirname);
    const runScript = `cd ${dirname} && ${language.run}`;
  
    fileHelper.createDir(dirname)
      .then(_ => {
        return fileHelper.writeFile(filename, code);
      })
      .then(_ => {
        if (needCompile) {
          return sysHelper.exec(compileScript)
            .then(std => {
              if (std.err) {
                socket.emit('result', `Error : Compile Failed (${std.err})`);
              } else {
                return sysHelper.exec(runScript)
              }
            })
        } else {
          return sysHelper.exec(runScript)
        }
      })
      .then(std => {
        if (std.out) {
          socket.emit('result', std.out);
        } else if (std.err) {
          socket.emit('result', std.err);
        } else {
          socket.emit('result', 'Error : Run Failed (Unknown Error)')
        }
        debug('Output Terkirim');
      })
      .catch(err => {
        socket.emit('result', err.message);
      })
  });
}

module.exports = codingRealtime;
