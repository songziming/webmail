define(function (require, exports, module) {
	var $ = require("jquery");
	var leftController = require("left");
	var userContorller = require("user");
	var headerController = require("header");


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
		}
	};

	var mainProgram = new main();
	module.exports = mainProgram;
});