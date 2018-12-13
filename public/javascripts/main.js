function show(elementId) {
	for(let element of document.getElementsByTagName('article')) {
		if (element.id == elementId) {
			element.style.display = 'block';
		} else {
			element.style.display = 'none';
		}
	}
}
show('download');

function filter(className) {
	let sections = document.getElementsByTagName('section');
	let tags = document.getElementsByClassName('filter');
	for(let tag of tags) {
		if (tag.classList.contains('filter-'+className)) {
			tag.classList.add('active');
		} else {
			tag.classList.remove('active');
		}
	}
	for(let section of sections) {
		if (section.classList.contains('hidden')) {
			section.style.display = 'none';
		} else if (section.classList.contains(className) || section.classList.contains('about') || className == 'semua') {
			section.style.display = 'inline-table';
		} else {
			section.style.display = 'none';
		}
	}
}
filter('semua');

// Koding Section
!function() {
	const lang = {
		"java": "public class Main {\n\tpublic static void main(String []args) {\n\t\tSystem.out.println(\"Hello, world!\");\n\t}\n}\n",
		"c++": "#include <iostream>\nusing namespace std;\n\nint main(int argc, char **argv) {\n\tcout<< \"Hello, world!\\n\";\n\treturn 0;\n}\n",
		"python": "print('Hello, world!')\n",
		"ruby": "puts 'Hello, world!'\n",
		"javascript": "console.log('Hello, world!')\n"
	}
	
	let selectBahasa = document.getElementById('bahasa');
	let inputBahasa = document.getElementById('input-bahasa');	
	let outputBahasa = document.getElementById('output-bahasa');
	selectBahasa.onchange = function(ev) {
		inputBahasa.value = lang[this.value];
	}
	inputBahasa.onkeydown = function(ev) {
		if (ev.key == 'Tab') {
			ev.preventDefault();
			var s = this.selectionStart;
			this.value = 
				this.value.substring(0, this.selectionStart) + 
				"\t" +
				this.value.substring(this.selectionEnd);
			this.selectionEnd = s+1;	
		}
	}
	
	let tombolRun = document.getElementById('run');
	tombolRun.onclick = function(ev) {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', '/api/coding/'+selectBahasa.value);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == xhr.DONE) {
				outputBahasa.value = xhr.response;
			}
		}
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({code: inputBahasa.value}));
	}

	inputBahasa.value = lang["java"];	
}()

// Chatting Section
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

// Chatting Initiation
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