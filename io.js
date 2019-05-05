var socketIO = require('socket.io');

var codingRealtime = require('./realtime/coding');
var chatRealtime = require('./realtime/chat');

module.exports = function(app) {
  var io = socketIO(app);

  io.of('/coding', codingRealtime);
  io.of('/chat', chatRealtime);
}
