/**
 * Created by wungcq on 15/7/3.
 */

define(function (require, exports, module) {
	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var tabPageController = require("tabPageController");

	function mailEditor(user) {
		this.init(user);
		return this;
	}

	mailEditor.prototype = {
		entities: [],//tab_id作为标识
		init: function (user) {
			var me = this;
			if (user) {
				me.user = user;
				me.register();
			}
		},

		register: function () {
			var me = this;

			if(mailEditor.prototype.entities==undefined){
				mailEditor.prototype.entities = [];
			}
			mailEditor.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		},

		render: function(tab_id) {
			var me = this;
			var txt = tmp("editor-page");
			var page = $("#tab-page-"+tab_id);
			var html = juicer(txt,{user:me.user});
			if(page.attr("rendered")==undefined){
				page.html(html);
				page.attr("rendered",1);
			}

		}
	};

	var m = new mailEditor();

	mailEditor.prototype.entity = function (arg) {
		if (arg.entity != undefined) {
			mailEditor.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return mailEditor.prototype.entities[ arg.tab_id ];
		}
	};

	mailEditor.prototype.newEditor = function (user) {
		var me = this;
		var user = user||'未选择';

		tabPageController.newTab('写给:'+user,
			function (tab_id) {
				var newEditor = new mailEditor(user);
				me.entity({
					tab_id: tab_id,
					entity: newEditor
				});
				me.render(tab_id);
			});
	};


	module.exports = m;
});