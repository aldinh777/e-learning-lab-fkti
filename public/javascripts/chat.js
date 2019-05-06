const socket = io('/chat');

!function() {

	function loggedIn() {
		document.getElementById('username-label').style.display = 'none';
		usernameInput.value = '';
		usernameInput.style.display = 'none';
		tombolLogin.style.display = 'none';
		tombolLogout.style.display = '';
		chatText.removeAttribute('disabled');
		chatKirim.removeAttribute('disabled');
	}

	let sessionUsername = document.getElementById('session-username');
	let sessionId = document.getElementById('session-id');
	let usernameInput = document.getElementById('username-login');
	let tombolLogin = document.getElementById('tombol-login');
	let tombolLogout = document.getElementById('tombol-logout');

	let chatText = document.getElementById('chat-text');
	let chatKirim = document.getElementById('chat-kirim');

	tombolLogin.onclick = function(ev) {
		if (!usernameInput.value) {
			alert("Please Input Username");
			return;
		}

		const id = sessionId.value;
		const username = usernameInput.value;

		socket.emit('login', id, username);
		sessionUsername.value = username;
		loggedIn();
	}
	
	tombolLogout.onclick = function(ev) {
		socket.emit('logout');
		window.location = '/';
	}

	chatText.onkeydown = function(ev) {
		if (ev.key == 'Enter') {
			chatKirim.click();
		}
	}

	chatKirim.onclick = function(ev) {
		if (!chatText.value) {
			alert('Text belum diisi');
		}

		const pesan = chatText.value;
		
		socket.emit('kirim', pesan);
		chatText.value = '';
	}
}()

!function() {

	function parseChat(response) {
		let sessionId = document.getElementById('session-id');
		let chatBody = document.getElementById('chat-body');
		while(chatBody.lastChild) {
			chatBody.removeChild(chatBody.lastChild);
		}
		let htmlParsed = response.map((msg)=> {
			let chatBox = document.createElement('div');
			if (msg.id == sessionId.value) {
				chatBox.className = 'chat-self';
				msg.username = 'Kamu';
			}
			else {
				chatBox.className = 'chat-box';
			}
			let chatContent = document.createElement('div');
			let name = document.createElement('h3');
			let text = document.createElement('p');
			name.append(msg.username);
			text.append(msg.message);
			chatContent.append(name, text);
			chatBox.append(chatContent);
			return chatBox;
		});
		chatBody.append(...htmlParsed);
		chatBody.scrollTop = chatBody.scrollHeight;
	}

	socket.on('message', (db) => {
		parseChat(db);
	});

	socket.on('init', (db) => {
		parseChat(db);
	});
}()
