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
	var tag = require("tag");

	function consumeController() {
//		this.init();
		return this;
	}

	consumeController.prototype = {
		init: function (mail_id) {

			var me = this;

			me.listWrapper = $("#consume-wrapper .left-mail-list");
			me.listToggleBtn = $("#consume-wrapper .mail-list-toggle-btn");
			me.list = $('#consume-wrapper .left-mail-list .mails-wrapper').eq(0);
			me.rightDetail = $("#consume-wrapper .right-detail-section").eq(0);
			me.filterBlock = $("#consume-mail-filter");

			me.bind();
			me.addFilter();
//			me.loadList();
			me.autoFresh();
			if (mail_id != undefined) {
				me.showDetail(mail_id);
			}
			user.list(function (list) {
				me.userList = list;
			});

		},
		loadTemplate: function () {
			var me = this;

			me.listItemTemplate = tmp("mail-list-item");
			me.detailTemplate = tmp("consume-mail-detail");
			me.pageTemplate = tmp("consume");
			me.userListTemplate = tmp('consumers-list');
			me.newReceiverTemplate = tmp("mail-receiver");
			me.filterTemplate = tmp("filter-search");
			me.auditorListTemplate = tmp("auditor-list");
		},
		render: function (mail_id) {

			var me = this;
			me.loadTemplate();

			me.wrapper = $("#tab-page-" + me.entity().tab_id);
			me.wrapper.html(me.pageTemplate);
			me.init(mail_id);

		},
		addFilter: function () {
			var me = this;
			tag.list(function (list) {
				var html = juicer(me.filterTemplate, list);
				me.filterBlock.html(html).select2().on("change", function (e) {
					me.loadList(true, 0);
				});
				var select = me.filterBlock.siblings(".select2-container").eq(0);
				var width = select.css("width");
				select.css({"width": "auto", "min-width": "150px"});

				me.loadList(true, 0);
			});
		},
		addSelectNumber: function () {
			var me = this;
			me.selectOr = $("#select-trans-number");
			me.selectOr3 = $("#select-auditor-to-commit");
			user.list(function (list) {
				var html = juicer(me.userListTemplate, list);
				me.selectOr.html(html).select2();
				var select = me.selectOr.siblings(".select2-container").eq(0);
				var width = select.css("width");
				select.css({"width": "auto", "min-width": "150px"});

				var html3 = juicer(me.auditorListTemplate, list);
				me.selectOr3.html(html3).select2();
				var select3 = me.selectOr3.siblings(".select2-container").eq(0);
				var width3 = select3.css("width");
				select.css({"width": "auto", "min-width": "150px"});
			});
		},
		addTagList: function () {
			var me = this;
			me.selectOr2 = $("#select-tag-to-stick");
			var tagArr = me.rightDetail.attr("data-tags");
			if (tagArr != "") {
				tagArr = tagArr.split(",");
				tagArr.splice(-1);
				for (var i in tagArr) {
					tagArr[ i ] = parseInt(tagArr[ i ]);
				}
			}

			tag.list(function (tagList) {
				var list = tagList.tags.concat();
				for (var j in tagArr) {
					if (tagArr.indexOf(list[ j ].id) != -1) {
						list[ j ].selected = 1;
					}
				}

				var html = juicer(me.tagListTemplate, {tags: list});
				me.selectOr2.html(html).select2();
				var select = me.selectOr2.siblings(".select2-container").eq(0);
				var width = select.css("width");
				select.css({"width": "auto", "min-width": "150px"});
			});
		},
		bind: function () {
			var me = this;
			//伸缩列表
			me.listToggleBtn.unbind('click').click(function () {
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
					var mailTags = tar.attr("data-tags");
					me.showDetail(id, mailTags);
				} else if (tar.hasClass("mail")) {

				} else {
					var t = tar.parents(".mail").eq(0);
					var id = t.attr("data-id");
					var mailTags = t.attr("data-tags");
					me.showDetail(id, mailTags);

				}
			});
			$('#consume-wrapper .mails-wrapper .mail.load-more').click(function () {
				me.loadMore();
			});

		},
		bindDetail: function (mail_id) {
			var me = this;
			me.receiverWrapper = $("#consume-wrapper .receiver-wrapper");
			me.consumeBtn = $("#consume-wrapper #consume-commit");
			me.commitBtn = $("#consume-commit-" + mail_id);
			me.urgentBtn = $("#urgent-commit-" + mail_id);
			me.transBtn = $("#mail-trans-commit-" + mail_id);

			me.commitBtn.click(function (e) {
				me.sendMail();
			});

			me.urgentBtn.click(function (e) {
				me.sendMail()
			});

			me.transBtn.click(function () {
				me.transMail();
			});

			$("#mail-return-" + mail_id).click(function () {
				me.returnMail();
			});

			me.ue = UE.getEditor('editor-' + mail_id);

			me.fullEditor = $("#full-editor-" + mail_id);
			me.ueWindow = $("#ue-window-" + mail_id);
			me.ueHideBtn = $('#ue-hide-' + mail_id);
			me.ueSaveBtn = $('#ue-save-' + mail_id);
			me.ueShowBtn = $('#ue-show-' + mail_id);

			me.ueHideBtn.click(function(){
				me.hideEditor();
			});
			me.ueSaveBtn.click(function(){
				me.hideEditor();
			});
			me.ueShowBtn.click(function(){
				me.showEditor();
			})

		},
		addReceiver: function (tar) {
			var me = this;
			tar.removeClass("add");
			$(me.newReceiverTemplate).insertBefore(me.consumeBtn);
		},

		addOne: function (data, ifRender) {
			var me = this;
			var html = me.listItemTemplate;
			ifRender && $(html).insertBefore('#consume-wrapper .left-mail-list .mails-wrapper .mail:first-child');
			return juicer(html, {'mail': data});
		},
		sendMail: function (isUrgent) {
			var me = this;
			var mail_to = me.commitBtn.attr("data-from").trim();
			var title = me.commitBtn.attr("data-title").trim();
			var mail_id = me.commitBtn.attr("data-id").trim();
			var text = me.ue.getPlainTxt();
			;
			var html = me.ue.getContent();
			var auditor_id = me.selectOr3.select2("val")[ 0 ];
			var data = {
				"title": '回复：' + title,
				"urgent": isUrgent || 0,
				"html": html,
				"text": text,
				"to": mail_to,
				"replyToId": parseInt(mail_id),
				"auditorId": auditor_id
			};
			mail.sendMail(data, function (res) {
				if (res.status == 1) {
					ALERT("提示", "服务器收到了你的回复！");
				} else {
					ALERT("提示消息", res.msg);
				}
			});
		},
		transMail: function () {
			var me = this;
			var mail_id = me.transBtn.attr("data-id");
			var to = me.selectOr.select2("val");
			to = to[ 0 ];
			var data = {
				mail: mail_id,
				assignee: to
			};
			mail.trans(data, function (res) {
				if (res.status == 1) {
					ALERT("提示", "转发成功，你已经失去了这封邮件的处理权");
				}
			});
		},
		returnMail: function () {
			var me = this;
			var mail_id = me.transBtn.attr("data-id");
			var data = {mail: mail_id};
			mail.returnMail(data, function (res) {
				if (res.status == 1) {
					ALERT("提示", "已成功回退");
				}
			});
		},
		hideEditor: function () {
			var me = this;
			me.fullEditor.removeClass("show");
//			me.fullEditor.hide();
		},
		showEditor: function(){
			var me = this;
//			me.fullEditor.show();
			me.fullEditor.addClass("show");
//			me.ueWindow.slideDown();
		}
		,
		loadList: function (ifFresh, latest) {
			var me = this;
			var filter = me.filterBlock.select2("val");

			var zeroIndex = filter.indexOf("0");
			if (zeroIndex != -1) {
				filter.splice(zeroIndex, 1);
			}
			var old = me.listWrapper.attr("data-old");
			mail.inboxList(latest, filter, function (res) {
				if (res.status == 1) {
					me.listWrapper.attr("data-old", res.old).attr("data-latest", res.latest);

					var html = [];

					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					if (ifFresh == true) {
						$("#consume-wrapper .mails-wrapper .mail:not('.load-more')").remove();
					}
					$(html).insertBefore('#consume-wrapper .mails-wrapper .mail:first-child');

				}
				else {

				}
			});
		},
		showDetail: function (mail_id, mailTags) {
			var me = this;
			mail.inboxMailDetail(mail_id, function (res) {
				if (res.status == 1) {
					for (var i in mailTags) {
						for (var j in res) {
							if (res[ j ] == '') {
							}
						}
					}
					var html = juicer(me.detailTemplate, res);
					me.rightDetail.html(html);
					me.rightDetail.attr("data-tags", mailTags);
					me.mail_id = mail_id;
					me.bindDetail(mail_id);
					me.addSelectNumber();
					me.listToggleBtn.trigger("click");
				}
				else {
				}
			});

		},
		commitDispatch: function () {
			var me = this;
			var result = me.selectOr.select2("val");
			var mail_id = me.mail_id;
			var str = result.join(",");
			str = "[" + str + "]";
			data = {
				mail: mail_id,
				consumers: str
			};

			mail.consume(data,
				function (res) {
					if (res.status == 1) {
						ALERT("提示", "分派成功");
					}
				},
				function (error) {

				})
		},
		commitTag: function () {
			var me = this;
			var result = me.selectOr2.select2("val");
			var mail_id = me.mail_id;
			var str = result.join(",");
			str = "[" + str + "]";
			data = {
				mail: mail_id,
				tags: str
			};

			tag.stick(data,
				function (res) {
					if (res.status == 1) {
						ALERT("提示", "分派成功");
					}
				},
				function (error) {

				});
		},
		register: function () {
			var me = this;
			if (consumeController.prototype.entities == undefined) {
				consumeController.prototype.entities = [];
			}
			consumeController.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		},
		autoFresh: function () {
			var me = this;
			me.timeer = setInterval(function () {
				var latest = me.listWrapper.attr("data-latest");
				me.loadList(false, latest);
			}, 5000);
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
					me.listWrapper.attr("data-old", res.old).attr("data-latest", res.latest);
					var html = [];
					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					$(html).insertBefore('#consume-wrapper .mails-wrapper .mail:first-child');
				}
				else {

				}
			});
		}

		//文本绑定

	};

	var d = new consumeController();

	consumeController.prototype.entity = function (arg) {
		if (!arg) {
			var res = consumeController.prototype.entities == undefined ? [ null ] : consumeController.prototype.entities;
			return res[ res.length - 1 ] || null;
		}
		else if (arg.entity != undefined) {
			if (consumeController.prototype.entities == undefined) {
				consumeController.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
			consumeController.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return consumeController.prototype.entities[ arg.tab_id ];
		}
	};

	consumeController.prototype.showPage = function (name, mail_id) {
		var me = this;
		var openedPage = me.entity();
		if (openedPage != null && $("#consume-wrapper").length > 0) {
			tabPageController.active(me.entity().tab_id);
		} else {
			tabPageController.newTab(name || '处理',
				function (tab_id) {
					me.entity({
						tab_id: tab_id,
						entity: me
					});
					me.render(mail_id);
				});
		}

	};

	module.exports = d;
});