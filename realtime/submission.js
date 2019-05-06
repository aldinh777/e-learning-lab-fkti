const debug = require('debug')('fragticquewm:submission');
const fileHandler = require('../helpers/file');

const submissionFile = 'submission.json';

function submissionUpdate(socket, submissions) {
  fileHandler.writeJSON(submissionFile, submissions);
  socket.broadcast.emit('submission-update', submissions);
  socket.emit('submission-update', submissions);
}

function submissionRealtime(socket) {
  debug('Terhubung dengan Submission');

  socket.on('tambah', (title, description) => {
    fileHandler.readJSON(submissionFile)
      .then(submissions => {
        submissions.push({title, description, answer: null});
        submissionUpdate(socket, submissions)
      })
  });

  socket.on('submit', (index, answer) => {
    fileHandler.readJSON(submissionFile)
      .then(submissions => {
        submissions[index].answer = answer;
        submissionUpdate(socket, submissions);
      })
  });

  fileHandler.readJSON(submissionFile)
    .then(submissions => {
      socket.emit('init', submissions);
    })
}

module.exports = submissionRealtime;
