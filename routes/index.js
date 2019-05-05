var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Praktikum Toolkit',
		username: req.session.username,
		id: req.sessionID,
	});
});

router.get('/form/:kelas', (req, res, next)=> {
	const aslab = {
		'A 2017': ["Aldi", "Fania", "Arvanda"],
		'B 2017': ["Daus", "Maul", "Anasya"],
		'C 2017': ["Hilmy", "Hendra", "Heryandi"],
		'D 2017': ["Gandhi", "Apriandi", "Heryandi"]
	}
	res.render('survey', {
		kelas: req.params.kelas,
		aslab: aslab[req.params.kelas]
	})
})

module.exports = router;
