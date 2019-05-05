!function() {
	
	const socket = io('/coding');

	const selectBahasa = document.getElementById('bahasa');
	const inputBahasa = document.getElementById('input-bahasa');	
	const outputBahasa = document.getElementById('output-bahasa');
	const tombolRun = document.getElementById('run');
	const lang = {
		"java": "public class Main {\n\tpublic static void main(String []args) {\n\t\tSystem.out.println(\"Hello, world!\");\n\t}\n}\n",
		"c++": "#include <iostream>\nusing namespace std;\n\nint main(int argc, char **argv) {\n\tcout<< \"Hello, world!\\n\";\n\treturn 0;\n}\n",
		"python": "print('Hello, world!')\n",
		"ruby": "puts 'Hello, world!'\n",
		"node.js": "console.log('Hello, world!')\n"
	};

	socket.on('result', function(output) {
		outputBahasa.value = output;
	})

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
	
	tombolRun.onclick = function(ev) {
		const bahasa = selectBahasa.value;
		const code = inputBahasa.value;

		socket.emit('bahasa', bahasa, code);
	}

	inputBahasa.value = lang["java"];	
}()
