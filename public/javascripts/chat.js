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
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/chat/login?username='+usernameInput.value);
		xhr.onreadystatechange = ()=> {
			if (xhr.readyState == xhr.DONE) {
				sessionUsername.value = usernameInput.value;
				loggedIn();
			}
		}
		xhr.send(null);
	}
	tombolLogout.onclick = function(ev) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', '/api/chat/logout');
		xhr.onreadystatechange = ()=> {
			if (xhr.readyState == xhr.DONE) {
				window.location = '/';
			}
		}
		xhr.send(null);
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
		let xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/chat/kirim');
		xhr.onreadystatechange = ()=> {
			if (xhr.readyState == xhr.DONE) {
				chatText.value = '';
			}
		}
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
			id: sessionId.value,
			username: sessionUsername.value,
			message: chatText.value
		}));
	}
	if (sessionUsername.value) {
		loggedIn();
	}
}()

!function() {
	function parseChat(response) {
		let sessionId = document.getElementById('session-id');
		let chatBody = document.getElementById('chat-body');
		while(chatBody.lastChild) {
			chatBody.removeChild( chatBody.lastChild );
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
			name.appendChild( document.createTextNode(msg.username) );
			text.appendChild( document.createTextNode(msg.message) );
			chatContent.appendChild(name);
			chatContent.appendChild(text);
			chatBox.appendChild(chatContent);
			return chatBox;
		});
		for(let element of htmlParsed) {
			chatBody.appendChild(element);
		}
		chatBody.scrollTop = chatBody.scrollHeight;
	}
	function fetchMessage() {
		fetch('/api/chat/fetch').then((value)=> {
			value.json().then((value)=> {
				parseChat(value);
				fetchMessage();
			}).catch((reason)=> {
				console.log(reason);
			});
		}).catch((reason)=> {
			console.log(reason);
		});
	}
	fetch('/api/chat/get').then((value)=> {
		value.json().then((value)=> {
			parseChat(value);
			fetchMessage();
		}).catch((reason)=> {
			console.log(reason);
		});
	}).catch((reason)=> {
		console.log(reason);
	});
}()
