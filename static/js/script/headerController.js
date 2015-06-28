define(function (require, exports, module) {
	var user = require("user");
	var $ = require("jquery");

	var headerController = function () {
		this.init();
		return this;
	};

	headerController.prototype = {
		init: function () {
			var me = this;
			me.loginLink = $(".header #login-trigger");
			me.loginWindow = $(".header #login-window");
			me.tipWrapper = $(".header #login-tip-wrapper");
			me.tip = $(".header #login-tip");
			me.loginBtn = $("#login-btn");
			me.bind();
		},
		bind: function () {
			var me = this;
			me.loginLink.unbind('click').on('click', me.showLoginWindow.bind(me));

			me.loginWindow.on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass('close-icon')) {
					me.toggleLoginWindow.call(me);
				} else if (tar.attr("id") == 'login-btn') {
					var loginData = me.getLoginWindowFormData.call(me);

					me._user = user.login(loginData,
					function(res){
						if(res){
							me.showTip('登录成功','success');
							var s = setTimeout(
								function () {
									me.toggleLoginWindow();
									clearTimeout(s);
								}, 1000);

						}else {
							me.showTip('登录失败','wrong');
						}
					},
					function(error){
						me.showTip(error,'warning');
					});
				}
			});
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
			me.tipWrapper.attr("class","tip-wrapper hide");
			callback && callback();
		},
		showTip: function (tipWord, type) {
			var me = this;
			me = me instanceof headerController? me : headerController;
			me.tip.html(tipWord);
			var t = ([ 'success', 'wrong', 'warning', 'hide' ].indexOf(type) == -1) ? 'success' : type;
			me.tipWrapper.removeClass('hide').addClass(t);
		},
		getLoginWindowFormData: function () {
			var me = this;
			var data = {};
			data[ "username" ] = me.loginWindow.find(".name-input").eq(0).val();
			data[ "pwd" ] = me.loginWindow.find(".pwd-input").eq(0).val();
			return data;
		}

	};
	module.exports = headerController;
});