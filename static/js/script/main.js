define(function (require, exports, module) {
	var $ = require("jquery");
	var leftController = require("left");
	var userContorller = require("user");
	var headerController = require("header");
	var mailListController = require("mailListController");
	var tab = require("tabPageController");
	var mouseWheel = require('mouseWheel');


	function main() {
		this.init();
		return this;
	}

	main.prototype = {
		init: function () {
			var me = this;
			me.readyBind();
		},
		readyBind: function () {
			var header = new headerController();
			var mailList = new mailListController();
			var leftNav = new leftController();
			$(document).bind("contextmenu",function(e){
				return false;
			});
		}
	};

	var mainProgram = new main();
	module.exports = mainProgram;
});