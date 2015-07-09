define(function (require, exports, module) {
//	var $ = require("jquery");
	var md5 = require("md5");
//	var headerController = (require("header")).prototype.entity;
	var is = require("is");

	var user = function (userInfo) {
		this.init(userInfo);
		this.name = null;
		this.loginPath = '/user/login/';
		this.logoutPath = '/user/logout/';
		this.allPath = '/user/all';
		this.deletePath = '/user/del';
		this.addPath = '/user/add';
		this.updatePath = '/user/update';
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
		setName: function (name) {
			var me = this;
			me.username = name;
		},
		getName: function () {
			return this.username;
		}

	};

	var u = new user();

	user.info = function (ready) {
		$.get('/user/info/', null, 'json')
			.done(function (res) {
				u.username = res.user.username;
				u.id = res.user.id;
				u.privilege = res.user.privilege || "none";
				u.pclass = res.user.privilege.slice(0, 3);
				$("body").removeClass("none").addClass(u.pclass);
				$(".header .user-block .user-name span").html(u.username);
				ready&&ready(u.pclass);

			});
	};

	user.login = function (userInfo, callback, readyCallBack) {
		var para = userInfo;

		if (is.truthy(para.username) && is.truthy(para.password)) {
			para.password = md5(para.password);
			$.post(u.loginPath, para, 'json')
				.done(function (response) {
					$("body").removeClass("none").addClass(u.pclass);
					callback && callback(response.status, response.msg);
					user.info(function(pclass){
						readyCallBack&&readyCallBack(pclass);
						window.location.reload();
					});
//
				})


		} else {

		}

	};

	user.logout = function () {
		$.get(u.logoutPath,
			{user: u.getName()},
			'json'
		).done(function (res) {
				if(res.status == 1){
					$("body").attr("class", "none index-page");
					ALERT('提醒','已退出！');
					window.location.reload();
				}else {
					ALERT('错误',res.msg);
				}
			});
	};

	user.entity = function () {
		return u;
	};

	user.all = function (callBack) {
		$.get(
			u.allPath,
			'json'
		).done(function (res) {
				callBack && callBack(res);
			});
	};

	user.list = function (aftercallback , isFresh) {
		if (isFresh || u.userList == undefined) {
			var arr = {'admin':[],'auditor':[],'consumer':[],'dispatcher':[]};
			user.all(function (userData) {
				$.each(userData.users, function (i, item) {
					for(var i in arr){
						if(item.privilege==i){
							arr[i ].push	(item);
						}
					}
				});
				u.userList = arr;
				aftercallback&&aftercallback(u.userList);
			});
		}else{
			aftercallback&&aftercallback(u.userList);
		}

	};

	user.delete = function (id, callback) {
		$.post(u.deletePath, id, 'json').done(function (res) {
			callback && callback(res);
		});
	};

	user.update = function (data, callback) {
		$.post(u.updatePath, data, 'json').done(function (res) {
			callback && callback(res);
		});
	};
	user.add = function (data, callback) {
		$.post(u.addPath, data, 'json').done(function (res) {
			callback && callback(res);
		});
	};

	user.privilege = function () {
		return u.privilege;
	};

	user.pclass = function () {
		return u.pclass;
	};

	//绑定变量
	user.entity.bind(u);

	module.exports = user;
});