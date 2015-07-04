define(function (require, exports, module) {
	var $ = require("jquery");
	var md5 = require("md5");
//	var headerController = (require("header")).prototype.entity;
	var is = require("is");

	var user = function (userInfo) {
		this.init(userInfo);
		this.name =  null;
		this.loginPath = '/user/login/';
		this.logoutPath = '/user/logout/';
		return this;
	};

	user.prototype = {
		init: function (userInfo, callback) {
			var me = this;
			if (userInfo) {
				me.userInfo = userInfo;
			}
			return me;
		},
		setName: function(name) {
			var me = this;
			me.username = name;
		},
		getName: function(){
			return this.username;
		}


	};


	var u = new user();

	user.login = function (userInfo, callback, error_callback) {
		var para = userInfo;

		if (is.truthy(para.username) && is.truthy(para.password)) {
//			para.password = md5(para.password);

			$.post(u.loginPath, para, 'json')
				.done(function (response) {
						callback && callback(response.status,response.msg);
				})
				.error(function (e) {
					error_callback && error_callback(e.responseText);
				});

		} else {

		}

	};

	user.logout = function(){
		$.get(u.logoutPath,
			{user: u.getName()}
		).done(function(){
				alert('已退出！');
			});
	};
	user.entity = function(){
		return u;
	};
	//绑定变量
	user.entity.bind(u);



	module.exports = user;
});