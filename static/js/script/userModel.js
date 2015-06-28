define(function (require, exports, module) {
	var $ = require("jquery");
	var md5 = require("md5");
//	var headerController = (require("header")).prototype.entity;
	var is = require("is");

	var user = function (userInfo) {
		this.init(userInfo);
		this.loginPath = '/api/login/';
		this.logoutPath = '/api/logout/';
		return this;
	};

	user.prototype = {
		init: function (userInfo,callback) {
			var me = this;
			if(userInfo){
				me.userInfo = userInfo;
			}
			return me;
		}
	};

	user.login = function (userInfo,callback,error_callback) {
		var para = userInfo;

		if (is.truthy(para.username) && is.truthy(para.pwd)) {
			para.pwd = md5(para.pwd);

			$.post(u.loginPath, para, 'json')
				.done(function (response) {
					callback&&callback(response);
				})
				.error(function (e) {

					error_callback&&error_callback(e.responseText);
				});

		} else {

		}

	};
	var u = new user();


	module.exports = user;
});