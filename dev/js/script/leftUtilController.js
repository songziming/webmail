define(function (require, exports, module) {
//	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");

	var peopleManager = require("peopleManage");
	var mailListController = require("mailListController");

	var tabPageController = require("tabPageController");
	var consumer = require("consumer");
	var tagManager = require("tagManager");
	var auditor = require("auditor");
	var user = require("user");

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

				if (tar.hasClass("nav-item people"))
				{
					if (user.pclass() == "adm") {
						peopleManager.showPage();
					}
				}
				else if (tar.hasClass("nav-item email"))
				{
					if (user.pclass() == "dis" || user.pclass() == "adm")
					{
						mailListController.showPage();
					}
					else if (user.pclass() == "con")
					{
						consumer.showPage();
					}
					else if (user.pclass() == "aud")
					{
						auditor.showPage();
					}
				}
				else if (tar.hasClass("nav-item dealed"))
				{
					var outbox = require("outbox");
					outbox.showPage();
				}
				else if (tar.hasClass("tags-manage"))
				{
					tagManager.showPage();
				}else if(tar.hasClass("deliver")){
					if(user.pclass() == "dis"){
						var dispatcher = require("dispatcher");
						dispatcher.showPage();
					}
				}else if(tar.hasClass("settings")){
					if(user.pclass() == 'adm'){
						var settings = require("settings");
						settings.showPage();
					}
				}

			}, false);
		}
	};

	module.exports = leftUtilController;
});