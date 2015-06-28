var express = require('express');
var router = express.Router();
var news_controller = require('../controllers/news_controller');

/* GET home page. */
router.get('/', function (req, res, next) {

	res.render('pages/index', {
		title: 'WebMail',
		user:{
			name: 'username'
		}
	});

});


module.exports = router;
