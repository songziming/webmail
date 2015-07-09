/**
 * Created by wungcq on 15/7/6.
 */


define(function (require, exports, module) {
//	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var tabPageController = require("tabPageController");
	var user = require("user");
	var tag = require("tag");
	var md5 = require("md5");

	function settings() {
		this.init();
		this.getPath = '/config/detail';
		this.editPath = '/config/edit';
		return this;
	}

	settings.prototype = {
		init: function () {
			var me = this;
			if (1) {
//				me.user = user;
				me.register();
			}
			me.pageTemplate = tmp("mail-settings");

		},
		render: function () {
			var me = this;
			tag.all(function (res) {
				var html = juicer(me.pageTemplate, res);
				me.wrapper = $("#tab-page-" + me.entity().tab_id);
				me.wrapper.html(html);
				me.bind();
			});
		},
		bind: function () {
			var me = this;
			$("#save-settings").click(function () {
				me.saveSettings();
			});
			$("#settings-back").click(function () {

			});
		},
		saveSettings: function () {
			var ad
		}

	};

	var t = new settings();

	settings.prototype.entity = function (arg) {
		if (!arg) {
			var res = settings.prototype.entities == undefined ? [ null ] : settings.prototype.entities;
			return res[ res.length - 1 ] || null;
			c
		}
		else if (arg.entity != undefined) {
			if (settings.prototype.entities == undefined) {
				settings.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
			settings.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return settings.prototype.entities[ arg.tab_id ];
		}
	};

	settings.prototype.showPage = function () {
		var me = this;
		var openedPage = me.entity();
		if (openedPage != null && $("#settings-wrapper").length > 0) {
			tabPageController.active(me.entity().tab_id);
		} else {
			tabPageController.newTab('邮箱设置',
				function (tab_id) {
					me.entity({
						tab_id: tab_id,
						entity: me
					});
					me.render();
				});
		}

	};

	module.exports = t;
});