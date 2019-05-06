var socketIO = require('socket.io');

var chatRealtime = require('./realtime/chat');
var codingRealtime = require('./realtime/coding');
var submissionRealtime = require('./realtime/submission');

function initSocketIO(app) {
  var io = socketIO(app);

  io.of('/chat', chatRealtime);
  io.of('/coding', codingRealtime);
  io.of('/submission', submissionRealtime);
}

module.exports = initSocketIO;
