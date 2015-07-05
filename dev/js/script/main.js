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
			mailListController.showPage();
			var leftNav = new leftController();
			userContorller.info();
			$(document).bind("contextmenu",function(e){
//				return false;
			});

		}
	};

	window.eMsg = function(e){
		var arr1 = ['Wrong password or username.',"Invalid access.","Unknown mail.","No task and please wait."];
		var arr2 = ['用户名或密码错误','无法获取到您清秋的数据','未知的邮件','没有任务，请等待' ];
		var i1 = arr1.indexOf(arr1);
		if(i1>-1) {
			return arr2[i1];
		}else {
			var i2 = arr2.indexOf(e);
			return arr1[i1];
		}
	};

	var mainProgram = new main();
	module.exports = mainProgram;
});