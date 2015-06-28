define(function (require, exports, module) {
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
			me.bind();
		},
		bind: function () {
			var me = this;
			me.loginLink.unbind('click').on('click', me.showLoginWindow.bind(me));

			me.loginWindow.on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass('close-icon')) {
					me.toggleLoginWindow.call(me);
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
			callback && callback();
		},
		showTip: function(tipWord){
			var me = this;
			me.tip.html(tipWord);
		}

	};

	module.exports = new headerController();
});