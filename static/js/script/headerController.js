define(function (require, exports, module) {
	var user = require("user");
	var mailListController = require("mailListController");
//	var $ = require("jquery");

	var headerController = function () {
		this.init();
		return this;
	};

	headerController.prototype = {
		init: function () {
			var me = this;
			me.loginLink = $(".header #login-trigger");
			me.loginWindow = $(".header #login-window");
			me.logoutLink = $(".header #logout-trigger");
			me.tipWrapper = $(".header #login-tip-wrapper");
			me.tip = $(".header #login-tip");
			me.loginBtn = $("#login-btn");
			me.bind();
		},
		bind: function () {
			var me = this;

			//绑定登录窗口触发
			me.loginLink.unbind('click').on('click', me.showLoginWindow.bind(me));


			//绑定登录窗口事件
			me.loginWindow.on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass('close-icon')) {
					me.toggleLoginWindow.call(me);
				} else if (tar.attr("id") == 'login-btn') {
					var loginData = me.getLoginWindowFormData.call(me);

					//user login
					me._user = user.login(
						loginData,
						function (isSuccess,msg) {
							if (isSuccess == 1) {

								user.entity().setName(loginData.username);

								me.showTip('登录成功', 'success');
								var s = setTimeout(
									function () {
										me.toggleLoginWindow();
										clearTimeout(s);
									}, 500);

							} else {
								if (msg == 'Wrong password or username.')
									me.showTip('用户名或密码错误', 'wrong');
							}
						}

					);

				}
			});

			//绑定登出
			me.logoutLink.unbind('click').on('click',user.logout);

		},
		showLoginWindow: function () {
			var me = this;
			me.loginWindow.addClass('fadeIn');
		},
		toggleLoginWindow: function (callback) {
			var me = this;
			me.loginWindow.addClass('fadeOut').removeClass('fadeIn').promise().done(function () {
				var s = setTimeout(
					function () {
						me.loginWindow.removeClass('fadeOut');
						clearTimeout(s);
					}, 300);
			});
			me.tipWrapper.attr("class", "tip-wrapper hide");
			callback && callback();
		},
		showTip: function (tipWord, type) {
			var me = this;
			me = me instanceof headerController ? me : headerController;
			me.tip.html(tipWord);
			var t = ([ 'success', 'wrong', 'warning', 'hide' ].indexOf(type) == -1) ? 'success' : type;
			me.tipWrapper.removeClass('hide').removeClass('wrong').removeClass('success').removeClass('warning').addClass(t);
		},
		getLoginWindowFormData: function () {
			var me = this;
			var data = {};
			data[ "username" ] = me.loginWindow.find(".name-input").eq(0).val();
			data[ "password" ] = me.loginWindow.find(".pwd-input").eq(0).val();
			return data;
		}

	};
	module.exports = headerController;
});