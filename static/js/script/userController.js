define(function (require, exports, module) {
	var $ = require("jquery");
	var md5 = require("MD5");
//	var headerController = (require("header")).prototype.entity;
	var is = require("is");

	var user = function (userInfo) {
		this.init(userInfo);
		this.loginPath = '/api/loginOK/';
		this.logoutPath = '/api/logout/';
		return this;
	};

	user.prototype = {
		init: function (userInfo) {
			var me = this;
			if (window.userInfo || userInfo.login == 1) {
				me.userInfo = userInfo;
			} else if (userInfo) {
				me.login(userInfo)
			} else {

			}
		},
		login: function (userInfo) {
			var para = userInfo;
			var me = this;

			if (is.truthy(para.username) && is.truthy(para.pwd)) {
				para.pwd = md5(para.pwd);

				$.post(me.loginPath, para, 'json')
					.done(function (response) {
						if (response.res) {
							headerController.showTip('登录成功','success');
							headerController.toggleLoginWindow(
								function(){
									//TODO
								}
							);
						}
					})
					.error(function (e) {
						headerController.showTip('登录失败','wrong');
					});

			} else {

			}

		}
	};

	module.exports = user;
});