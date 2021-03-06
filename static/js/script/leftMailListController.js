/**
 * Created by wungcq on 15/6/29.
 */
define(function (require, exports, module) {
//	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var tabPageController = require("tabPageController");
	var user = require("user");
	var mail = require("mail");
	var mailEditor = require("mailEditor");
	var dispatcher = require("dispatcher");
	var stickTagView = require("");
	var tag = require("tag");

	function mailListController() {
//		this.init();
		return this;
	}

	mailListController.prototype = {
		init: function (tab_id) {

			var me = this;

			me.listWrapper = $("#mail-list-wrapper .left-mail-list");
			me.listToggleBtn = $("#mail-list-wrapper .mail-list-toggle-btn");
			me.list = $('#mail-list-wrapper .left-mail-list .mails-wrapper').eq(0);
			me.rightDetail = $("#mail-list-wrapper .right-detail-section").eq(0);
			me.filterBlock = $("#mail-list-wrapper #mail-list-filter");

			me.bind();

			me.addFilter();
			me.autoFresh();
		},
		loadTemplate: function () {
			var me = this;

			me.listItemTemplate = tmp("mail-list-item");
			me.detailTemplate = tmp("mail-detail");
			me.pageTemplate = tmp("mail-list-page");
			me.filterTemplate = tmp("filter-search");
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
			me.listToggleBtn.unbind('click').on('click', function (e) {
				if (me.listWrapper.hasClass("show")) {
					me.listWrapper.addClass("hide").removeClass("show");
					me.listToggleBtn.attr("title", "展开列表");
					me.rightDetail.addClass("full-width");
				} else {
					if (me.listWrapper.hasClass("hide")) {
						me.listWrapper.removeClass("hide").addClass("show");
						me.listToggleBtn.attr("title", "收起列表");
						me.rightDetail.removeClass("full-width");
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
			$('#mail-list-wrapper .left-mail-list .mails-wrapper .mail.load-more').eq(0).click(function(){
				me.loadMore();
			});

		},

		addFilter: function () {
			var me = this;
			tag.list(function (list) {
				var html = juicer(me.filterTemplate, list);
				me.filterBlock.html(html).select2().on("change", function (e) {
					me.loadList(true,0);
				});
				var select = me.filterBlock.siblings(".select2-container").eq(0);
				var width = select.css("width");
				select.css({"width": "auto", "min-width": "150px"});

				me.loadList(true,0);
			});
		},

		addOne: function (data, ifRender) {
			var me = this;
			var html = me.listItemTemplate;
			ifRender && $(html).insertBefore('#mail-list-wrapper .left-mail-list .mails-wrapper .mail:first-child');
			return juicer(html, {'mail': data});

		},

		loadList: function (ifFresh, start) {
			var me = this;
			var filter = me.filterBlock.select2("val");
			if(filter == undefined){filter=[0];}
			var zeroIndex = filter.indexOf("0");
			if (zeroIndex != -1) {
				filter.splice(zeroIndex, 1);
			}

			mail.inboxList(start, filter, function (res) {
				if (res.status == 1) {
					me.listWrapper.attr("data-old", res.old).attr("data-latest",res.latest);
					var html = [];

					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					if (ifFresh == true) {
						$("#mail-list-wrapper .left-mail-list .mails-wrapper .mail:not('.load-more')").remove();
					}
					$(html).insertBefore('#mail-list-wrapper .left-mail-list .mails-wrapper .mail:first-child');
				}
				else {

				}
			});
		},
		loadMore: function () {
			var me = this;
			var filter = me.filterBlock.select2("val");

			var zeroIndex = filter.indexOf("0");
			if (zeroIndex != -1) {
				filter.splice(zeroIndex, 1);
			}
			var old = me.listWrapper.attr("data-old");
			mail.inboxLoadMore(old, filter, function (res) {
				if (res.status == 1) {
					me.listWrapper.attr("data-old", res.old).attr("data-latest",res.latest);
					var html = [];
					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					$(html).insertBefore('#mail-list-wrapper .left-mail-list .mails-wrapper .mail:first-child');
				}
				else {

				}
			});
		},
		showDetail: function (mail_id) {
			var me = this;
			mail.inboxMailDetail(mail_id, function (res) {
				if (res.status == 1) {
					var html = juicer(me.detailTemplate, res);
					me.detailData = res;
					me.rightDetail.html(html);
					me.bindDetail(mail_id);
				}
				else {
				}
			});

		},
		bindDetail: function (mail_id) {
			var me = this;
			me.btnWrapper = $("#tab-page-" + me.entity().tab_id + ' .manu-col').eq(0);
			me.btnWrapper.unbind('click').on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass("f-tag")) {
//					mailEditor.newEditor(me.detailData);
					var mail_id = tar.attr("data-id");
					dispatcher.showPage('邮件分类', mail_id);

				} else if (tar.hasClass("f-dis")) {
					var mail_id = tar.attr("data-id");
					dispatcher.showPage('邮件分发', mail_id);
				} else if (tar.hasClass("f-con")) {

				} else if (tar.hasClass("f-aud")) {

				}
			});
		},
		register: function () {
			var me = this;
			if (mailListController.prototype.entities == undefined) {
				mailListController.prototype.entities = [];
			}
			mailListController.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		},
		autoFresh: function () {
			var me = this;
			me.timeer = setInterval(function () {
				var latest = me.listWrapper.attr("data-latest");
				me.loadList(false,latest);
			}, 5000);
		}

	};

	var m = new mailListController();

	mailListController.prototype.entity = function (arg) {
		if (!arg) {
			var res = mailListController.prototype.entities == undefined ? [ null ] : mailListController.prototype.entities;
			return res[ res.length - 1 ] || null;
		}
		else if (arg.entity != undefined) {
			if (mailListController.prototype.entities == undefined) {
				mailListController.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
			mailListController.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return mailListController.prototype.entities[ arg.tab_id ];
		}
	};

	mailListController.prototype.showPage = function () {
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