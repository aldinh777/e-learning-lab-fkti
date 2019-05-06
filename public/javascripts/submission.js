!function() {
  const socket = io('/submission');

  const submissionList = document.getElementById('submission-list');
  const submissionTitle = document.getElementById('submission-title');
  const submissionDesc = document.getElementById('submission-text');
  const tombolTambah = document.getElementById('submission-button');

  function fetchSubmission(submissions) {
    while (submissionList.lastChild) {
      submissionList.removeChild(submissionList.lastChild)
    }
    const htmlParsed = submissions.map((submission, index) => {
      const submissionItem = document.createElement('div');
      const title = document.createElement('h4');
      const description = document.createElement('p');
      const answer = document.createElement('textarea');
      const submitButton = document.createElement('button');
      
      submissionItem.className = 'submission-item';
      submitButton.className = 'submission-submit';      
      answer.rows = 5;

      title.append(submission.title);
      description.append(submission.description);
      if (submission.answer === null) {
        submitButton.append('Kirim Jawaban');

        submitButton.onclick = function() {
          const jawaban = answer.value;

          socket.emit('submit', index, jawaban);
        }
      } else {
        submitButton.append('Jawaban Terkirim');
        answer.value = submission.answer;
        answer.disabled = 'disabled';
        submitButton.disabled = 'disabled';
      }

      submissionItem.append(title, description, answer, submitButton);
      return submissionItem;
    });
    submissionList.append(...htmlParsed.reverse());
  }

  tombolTambah.onclick = function() {
    const judul = submissionTitle.value;
    const deskripsi = submissionDesc.value;

    if (!judul) {
      return alert('Judul Belum Terisi');
    }
    if (!deskripsi) {
      return alert('Deskripsi Kosong');
    }

    socket.emit('tambah', judul, deskripsi);

    submissionTitle.value = '';
    submissionDesc.value = '';
  }

  socket.on('init', submissions => {
    fetchSubmission(submissions);
  });

  socket.on('submission-update', (submissions) => {
    fetchSubmission(submissions);
  });
}()
