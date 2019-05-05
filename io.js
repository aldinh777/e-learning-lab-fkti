var socketIO = require('socket.io');

var codingRealtime = require('./realtime/coding');

module.exports = function(app) {
  var io = socketIO(app);

  io.of('/coding', codingRealtime);
};
