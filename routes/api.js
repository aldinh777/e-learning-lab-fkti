var express = require('express');
var router = express.Router();
var fs = require('fs');
var cp = require('child_process');
var lang = require('../lang');
var events = require('events');
var chat = new events.EventEmitter();

/* GET home page. */
router.post('/coding/:bahasa', function(req, res, next) {
	let used = req.params.bahasa;
	let dir = 'source/'+Math.random();
	fs.mkdir(dir, (err)=> {
		if (err) console.log(err);
		fs.writeFile(dir+'/'+lang[used].file, req.body.code, (err)=> {
			if (err) console.log(err);
			if (lang[used].compile) {
				cp.exec(lang[used].compile.replace(/<<@dirname>>/g, dir), (err, stdout, stderr)=> {
					if (err) console.log(err);
					if (stderr) {
						return res.end(stderr);
					}
					cp.exec('cd '+dir+';'+lang[used].run, (err, stdout, stderr)=> {
						if (err) console.log(err);
						if (stdout) {
							res.end(stdout);
						} else if(stderr) {
							res.end(stderr);
						} else {
							res.end("Error : Run Failed (Unknown Error)");
						}
					});
				});				
			} else {
				cp.exec('cd '+dir+';'+lang[used].run, (err, stdout, stderr)=> {
					if (err) console.log(err);
					if (stdout) {
						res.end(stdout);
					} else if(stderr) {
						res.end(stderr);
					} else {
						res.end("Error : Run Failed (Unknown Error)");
					}
				});
			}
		});
	});
});

router.get('/chat/login', function(req, res, next) {
	req.session.username = req.query.username;
	res.end('Logged In');
});

router.get('/chat/logout', function(req, res, next) {
	req.session.destroy();
	res.end('Logged Out');
});

router.post('/chat/kirim', function(req, res, next) {
	fs.readFile('chat.json', (err, data)=> {
		if (err) return console.log(err);
		let db = JSON.parse(data);
		db.push(req.body);
		fs.writeFile('chat.json', JSON.stringify(db), (err)=> {
			if (err) return console.log(err);
			chat.emit('send');
			res.end('Success');
		});
	})
});

router.get('/chat/get', function(req, res, next) {
	fs.readFile('chat.json', (err, data)=> {
		if (err) console.log(err);
		res.end(data);
	});
});

router.get('/chat/fetch', function(req, res, next) {
	chat.once('send', ()=> {
		fs.readFile('chat.json', (err, data)=> {
			if (err) console.log(err);
			res.end(data);
		});
	});
});

module.exports = router;
