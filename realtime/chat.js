const debug = require('debug')('fragticquewm:chat');
const fileHandler = require('../helpers/file');

const chatFile = 'chat.json';


function chatRealtime(socket, chat) {
  debug('Terkoneksi dengan Chat');
  const user = {
    id: '',
    name: 'anonymous',
  }

  socket.on('login', (id, username) => {
    user.id = id
    user.name = username;
    debug('Berhasil Login')
  });

  socket.on('logout', _ => {
    username = 'anonymous';
  });

  socket.on('kirim', pesan => {
    fileHandler.readJSON(chatFile)
      .then(db => {
        db.push({
          id: user.id,
          username: user.name,
          message: pesan,
        });
        fileHandler.writeJSON(chatFile, db);
        socket.broadcast.emit('message', db);
        socket.emit('message', db);
        debug('Pesan Terkirim');
      })
  });

  fileHandler.readJSON(chatFile)
    .then(db => {
      socket.emit('init', db);
    });
}

module.exports = chatRealtime;
