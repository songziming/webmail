define(function (require, exports, module) {
	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var mailEditor = require("mailEditor");
	var peopleManager = require("peopleManage");
	var tabPageController = require("tabPageController");

	function leftUtilController() {
		this.init();
		return this;
	}

	leftUtilController.prototype = {
		init: function () {
			var me = this;
			me.leftNav = $(".left-nav");
			me.bind();
		},
		bind: function () {
			var me = this;
			me.leftNav.unbind("click").get(0).addEventListener('click', function (e) {
				var tar = $(e.target);
				if(tar.hasClass("write")){
					mailEditor.newEditor();
				}else if(tar.hasClass("nav-item people")){
					peopleManager.showPage();
				}
			}, false);
		}
	};

	module.exports = leftUtilController;
});