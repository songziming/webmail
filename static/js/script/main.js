define(function (require, exports, module) {
	var $ = require("jquery");
	var leftController = require("left");
	var userContorller = require("user");
	var headerController = require("header");
	var mailListController = require("mailListController");
	var tab = require("tabPageController");


	function main() {
		this.init();
		return this;
	}

	main.prototype = {
		init: function () {
			var me = this;
			me.readyBind();
			var tabManager = new tab();
		},
		readyBind: function () {
			var header = new headerController();
			var mailList = new mailListController();
			$(document).bind("contextmenu",function(e){
				return false;
			});
		}
	};

	var mainProgram = new main();
	module.exports = mainProgram;
});