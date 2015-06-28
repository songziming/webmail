var express = require('express');
var router = express.Router();
var news_controller = require('../controllers/news_controller');

/* GET home page. */
router.get('/', function (req, res, next) {

	res.render('pages/index', {
		title: 'WebMail',
		user_info:{
			user_name: '用户名2333'
		}
	});

});


module.exports = router;
