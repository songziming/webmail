/**
 * Created by wungcq on 15/6/29.
 */
define(function (require, exports, module) {
	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var tabPageController = require("tabPageController");
	var user = require("user");
	var mail = require("mail");

	function dispachController() {
//		this.init();
		return this;
	}

	dispachController.prototype = {
		init: function (tab_id) {

			var me = this;

			me.listWrapper = $("#mail-list-wrapper #left-mail-list");
			me.listToggleBtn = $("#mail-list-wrapper #mail-list-toggle-btn");
			me.list = $('#left-mail-list .mails-wrapper').eq(0);
			me.rightDetail = $("#mail-list-wrapper .right-detail-section").eq(0);

			me.bind();
			me.loadList();
			me.autoFresh();
		},
		loadTemplate: function () {
			var me = this;

			me.listItemTemplate = tmp("mail-list-item");
			me.detailTemplate = tmp("mail-detail");
			me.pageTemplate = tmp("mail-list-page");
		},
		render: function () {

			var me = this;
			me.loadTemplate();

			me.wrapper = $("#tab-page-" + me.entity().tab_id);
			me.wrapper.html(me.pageTemplate);
			me.init();

		},
		bind: function () {
			var me = this;
			//伸缩列表
			me.listToggleBtn.unbind('click').click(function () {
				if (me.listWrapper.hasClass("show")) {
					me.listWrapper.addClass("hide").removeClass("show");
					me.listToggleBtn.attr("title", "展开列表");
				} else {
					if (me.listWrapper.hasClass("hide")) {
						me.listWrapper.removeClass("hide").addClass("show");
						me.listToggleBtn.attr("title", "收起列表");
					}
				}
			});

			//显示邮件内容
			me.list.on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass("mail-load-more mail")) {
					var id = tar.attr("data-id");
					me.showDetail(id);
				} else if (tar.hasClass("mail")) {

				} else {
					var t = tar.parents(".mail").eq(0);
					var id = t.attr("data-id");
					me.showDetail(id);

				}
			});

		},
		addOne: function (data, ifRender) {
			var me = this;
			var html = me.listItemTemplate;
			ifRender && $(html).insertBefore('#mail-list-wrapper #left-mail-list .mails-wrapper .mail:first-child');
			return juicer(html, {'mail': data});

		}

		,
		loadList: function (start) {
			var me = this;
			mail.inboxList(start, function (res) {
				if (res.status == 1) {
					me.listWrapper.attr("data-count", res.count);

					var html = [];

					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					$(html).insertBefore('#mail-list-wrapper #left-mail-list .mails-wrapper .mail:first-child');

				}
				else {

				}
			});
		},
		showDetail: function (mail_id) {
			var me = this;
			mail.inboxMailDetail(mail_id, function (res) {
				if (res.status == 1) {
					var html = juicer(me.detailTemplate, res)
					me.rightDetail.html(html);
				}
				else {
				}
			});

		},
		register: function () {
			var me = this;
			if (dispachController.prototype.entities == undefined) {
				dispachController.prototype.entities = [];
			}
			dispachController.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		},
		autoFresh: function () {
			var me = this;
			me.timeer = setInterval(function(){
				var start = me.listWrapper.attr("data-count");
				me.loadList(start);
			},5000);
		}

	};

	var m = new dispachController();

	dispachController.prototype.entity = function (arg) {
		if (!arg) {
			var res = dispachController.prototype.entities == undefined ? [ null ] : dispachController.prototype.entities;
			return res[ res.length - 1 ] || null;
		}
		else if (arg.entity != undefined) {
			if (dispachController.prototype.entities == undefined) {
				dispachController.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
			dispachController.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return dispachController.prototype.entities[ arg.tab_id ];
		}
	};

	dispachController.prototype.showPage = function () {
		var me = this;
		var openedPage = me.entity();
		if (openedPage != null && $("#mail-list-wrapper").length > 0) {
			tabPageController.active(me.entity().tab_id);
		} else {
			tabPageController.newTab('收件箱',
				function (tab_id) {
					me.entity({
						tab_id: tab_id,
						entity: me
					});
					me.render();
				});
		}

	};

	module.exports = m;
});