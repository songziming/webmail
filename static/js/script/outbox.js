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

	function outboxController() {
//		this.init();
		return this;
	}

	outboxController.prototype = {
		init: function (mail_id) {

			var me = this;

			me.listWrapper = $("#outbox-list-wrapper .left-mail-list");
			me.listToggleBtn = $("#outbox-list-wrapper .mail-list-toggle-btn");
			me.list = $('#outbox-list-wrapper .left-mail-list .mails-wrapper').eq(0);
			me.rightDetail = $("#outbox-list-wrapper .right-detail-section").eq(0);
			me.filterBlock = $("#outbox-list-filter");

			me.bind();
			me.addFilter();
//			me.loadList();
			me.autoFresh();
			if (mail_id != undefined) {
				me.showDetail(mail_id);
			}

			user.list(
				function(list){
					me.userList = list;
				}
			)

		},
		loadTemplate: function () {
			var me = this;

			me.listItemTemplate = tmp("outbox-list-item");
			me.detailTemplate = tmp("outbox-mail-detail");
			me.pageTemplate = tmp("outbox-list-page");
			me.userListTemplate = tmp('user-list');
			me.newReceiverTemplate = tmp("mail-receiver");
			me.tagListTemplate = tmp("tags-drop");
			me.filterTemplate = tmp("filter-search");
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
				select.css({"width": "auto", "min-width": width});
				me.loadList(true, 0);
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

		},
		bindDetail: function () {
			var me = this;
			me.receiverWrapper = $("#outbox-list-wrapper .receiver-wrapper");
			me.auditorBtn = $("#outbox-list-wrapper #pass-mail");

			me.receiverWrapper.unbind('click').on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass("icon-add-receiver")) {
					me.addReceiver(tar.parent());
				} else if (tar.hasClass("mail-receiver")) {
					me.addReceiver(tar);
				} else if (e.target.id == "auditor-commit") {
					me.commitDispatch();
				} else if (e.target.id == "stick-tag-commit") {
					me.commitTag();
				}
			});

			var mail_id = me.auditorBtn.attr("data-id");
			me.auditorBtn.click(function(){
				me.passMail(mail_id);
			});
			$("#reject-mail").click(function(){
				me.rejectMail(mail_id);
			});

			$("#rewrite").click(function(){
				if(user.pclass()=="con"){
					var consumer = require("consumer");
					consumer.showPage('重处理',mail_id);
				}
			});

		},
		passMail:function(mail_id){
			mail.auditPass({mail:mail_id},function(res){
				if(res.status == 1){
					ALERT("提示","已经通过！");
				}
			});
		},
		rejectMail: function(mail_id){
			var reason = $("#reject-reason").val();
			mail.auditReject({reason:reason,mail:mail_id},function(res){
				if(res.status == 1){
					ALERT("提示","已拒绝！");
				}
			});
		},
		addOne: function (data, ifRender) {
			var me = this;
			var html = me.listItemTemplate;
			ifRender && $(html).insertBefore('#outbox-list-wrapper .left-mail-list .mails-wrapper .mail:first-child');
			return juicer(html, {'mail': data});
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
			mail.outboxList(latest, filter, function (res) {
				if (res.status == 1) {
					me.listWrapper.attr("data-old", res.old).attr("data-latest",res.latest);

					var html = [];

					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					if (ifFresh == true) {
						$("#outbox-list-wrapper .mails-wrapper .mail:not('.load-more')").remove();
					}
					$(html).insertBefore('#outbox-list-wrapper .mails-wrapper .mail:first-child');

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
			var old = me.wrapper.attr("data-old");
			mail.outboxLoadMore(old, filter, function (res) {
				if (res.status == 1) {
					me.listWrapper.attr("data-old", res.old).attr("data-latest",res.latest);
					var html = [];
					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					$(html).insertBefore('#outbox-list-wrapper .mails-wrapper .mail:first-child');
				}
				else {

				}
			});
		},

		showDetail: function (mail_id, mailTags) {
			var me = this;
			mail.outboxMailDetail(mail_id, function (res) {


				if (res.status == 1) {
					for (var i in mailTags) {
						for (var j in res) {
							if (res[ j ] == '') {
							}
						}
					}
					user.list(
						function(list){
							me.userList = list;
							for(var c in me.userList.consumer ){
								if(me.userList.consumer[c ].id == res.mail.consumerId){
									res.mail.consumer =me.userList.consumer[c ].username;
									break;
								}
							}
//							res.mail.consumer = me.userList[me.userList.consumer.indexOf(res.mail.consumerId)];
							var html = juicer(me.detailTemplate, res);
							me.rightDetail.html(html);
							me.rightDetail.attr("data-tags", mailTags);
							me.mail_id = mail_id;
							me.bindDetail();
							me.addSelectNumber();
							me.addTagList();
							me.listToggleBtn.trigger("click");
						}
					)

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

			mail.auditor(data,
				function (res) {
					if (res.status == 1) {
						ALERT("提示","成功");
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
						ALERT("提示","分派成功");
					}
				},
				function (error) {

				});
		},
		register: function () {
			var me = this;
			if (outboxController.prototype.entities == undefined) {
				outboxController.prototype.entities = [];
			}
			outboxController.prototype.entities.push({
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
		}

	};

	var d = new outboxController();

	outboxController.prototype.entity = function (arg) {
		if (!arg) {
			var res = outboxController.prototype.entities == undefined ? [ null ] : outboxController.prototype.entities;
			return res[ res.length - 1 ] || null;
		}
		else if (arg.entity != undefined) {
			if (outboxController.prototype.entities == undefined) {
				outboxController.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
			outboxController.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return outboxController.prototype.entities[ arg.tab_id ];
		}
	};

	outboxController.prototype.showPage = function (name, mail_id) {
		var me = this;
		var openedPage = me.entity();
		if (openedPage != null && $("#outbox-list-wrapper").length > 0) {
			tabPageController.active(me.entity().tab_id);
		} else {
			tabPageController.newTab(name || '发件箱',
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