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

	function auditorController() {
//		this.init();
		return this;
	}

	auditorController.prototype = {
		init: function (mail_id) {

			var me = this;

			me.listWrapper = $("#auditor-wrapper .left-mail-list");
			me.listToggleBtn = $("#auditor-wrapper .mail-list-toggle-btn");
			me.list = $('#auditor-wrapper .left-mail-list .mails-wrapper').eq(0);
			me.rightDetail = $("#auditor-wrapper .right-detail-section").eq(0);
			me.filterBlock = $("#auditor-mail-filter");

			me.bind();
			me.addFilter();
//			me.loadList();
			me.autoFresh();
			if (mail_id != undefined) {
				me.showDetail(mail_id);
			}

			user.list(
				function (list) {
					me.userList = list;
				}
			)

		},
		loadTemplate: function () {
			var me = this;

			me.listItemTemplate = tmp("outbox-list-item");
			me.detailTemplate = tmp("auditor-mail-detail");
			me.pageTemplate = tmp("auditor");
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
				select.css({"width": "auto", "min-width": "150px"});

				me.loadList(true, 0);
			});
		},
		addSelectNumber: function () {
			var me = this;
			me.selectOr = $("#select-auditor-number");
			user.list(function (list) {
				var html = juicer(me.userListTemplate, list);
				me.selectOr.html(html).select2();
				var select = me.selectOr.siblings(".select2-container").eq(0);
				var width = select.css("width");
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
				select.css({"width": "auto", "min-width": width});
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
			me.receiverWrapper = $("#auditor-wrapper .receiver-wrapper");
			me.auditorBtn = $("#auditor-wrapper #pass-mail");

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
			me.auditorBtn.click(function () {
				me.passMail(mail_id);
			});
			$("#reject-mail").click(function () {
				me.rejectMail(mail_id);
			});

			me.ue = UE.getEditor('editor-' + mail_id);
			var s = setTimeout(function(){
				me.ue.setContent(me.detailData.html);
				clearTimeout(s);
			},1000);

			me.fullEditor = $("#full-editor-" + mail_id);
			me.ueWindow = $("#ue-window-" + mail_id);
			me.ueHideBtn = $('#ue-hide-' + mail_id);
			me.ueSaveBtn = $('#ue-save-' + mail_id);
			me.ueShowBtn = $('#ue-show-' + mail_id);
			me.saveChangeBtn = $('#save-change-' + mail_id);

			me.ueHideBtn.click(function () {
				me.hideEditor();
			});
			me.ueSaveBtn.click(function () {
				me.hideEditor();
			});
			me.ueShowBtn.click(function () {
				me.showEditor();
			});
			me.saveChangeBtn.click(function(){
				me.saveChangeAndPass(mail_id);
			});

		},
		hideEditor: function () {
			var me = this;
			me.fullEditor.removeClass("show");
//			me.fullEditor.hide();
		},
		showEditor: function () {
			var me = this;
//			me.fullEditor.show();
			me.fullEditor.addClass("show");
//			me.ueWindow.slideDown();
		},
		saveChangeAndPass:function(mail_id){
			var me = this;
			var data = {};
			data.mail = mail_id;
			data.title = me.detailData.title;
			data.html = me.ue.getContent();
			data.text = me.ue.getPlainTxt();
			data.to = me.detailData.to;
			mail.outboxEdit(data,function(e){
				ALERT('修改成功','您已经成功修改了这封邮件');
			})
		}
		,
		passMail: function (mail_id) {
			mail.auditPass({mail: mail_id}, function (res) {
				if (res.status == 1) {
					ALERT("提示", "已经通过！");
				}
			});
		},
		rejectMail: function (mail_id) {
			var reason = $("#reject-reason").val();
			mail.auditReject({reason: reason, mail: mail_id}, function (res) {
				if (res.status == 1) {
					ALERT("提示", "已拒绝！");
				}
			});
		},
		addOne: function (data, ifRender) {
			var me = this;
			var html = me.listItemTemplate;
			ifRender && $(html).insertBefore('#auditor-wrapper .left-mail-list .mails-wrapper .mail:first-child');
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
					me.listWrapper.attr("data-old", res.old).attr("data-latest", res.latest);

					var html = [];

					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					if (ifFresh == true) {
						$("#auditor-wrapper .mails-wrapper .mail:not('.load-more')").remove();
					}
					$(html).insertBefore('#auditor-wrapper .mails-wrapper .mail:first-child');

				}
				else {

				}
			});
		},
		loadMore: function (latest) {
			var me = this;
			var filter = me.filterBlock.select2("val");

			var zeroIndex = filter.indexOf("0");
			if (zeroIndex != -1) {
				filter.splice(zeroIndex, 1);
			}
			var old = me.wrapper.attr("data-old");
			mail.outboxLoadMore(latest, filter, function (res) {
				if (res.status == 1) {
					me.listWrapper.attr("data-old", res.old).attr("data-latest", res.latest);
					var html = [];
					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					$(html).insertBefore('#auditor-wrapper .mails-wrapper .mail:first-child');
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
						function (list) {
							me.userList = list;
							for (var c in me.userList.consumer) {
								if (me.userList.consumer[ c ].id == res.mail.consumerId) {
									res.mail.consumer = me.userList.consumer[ c ].username;
									break;
								}
							}
//							res.mail.consumer = me.userList[me.userList.consumer.indexOf(res.mail.consumerId)];
							var html = juicer(me.detailTemplate, res);
							me.rightDetail.html(html);
							me.rightDetail.attr("data-tags", mailTags);
							me.mail_id = mail_id;
							me.detailData = res.mail;
							me.bindDetail();
							me.addSelectNumber();
							me.addTagList();
							me.listToggleBtn.trigger("click");


						}
					);

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
			if (auditorController.prototype.entities == undefined) {
				auditorController.prototype.entities = [];
			}
			auditorController.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		},
		autoFresh: function () {
			var me = this;
			me.timeer = setInterval(function () {
				var latest = me.listWrapper.attr("data-latest");
				me.loadList(false, latest);
			}, 10000);
		}

	};

	var d = new auditorController();

	auditorController.prototype.entity = function (arg) {
		if (!arg) {
			var res = auditorController.prototype.entities == undefined ? [ null ] : auditorController.prototype.entities;
			return res[ res.length - 1 ] || null;
		}
		else if (arg.entity != undefined) {
			if (auditorController.prototype.entities == undefined) {
				auditorController.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
			auditorController.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return auditorController.prototype.entities[ arg.tab_id ];
		}
	};

	auditorController.prototype.showPage = function (name, mail_id) {
		var me = this;
		var openedPage = me.entity();
		if (openedPage != null && $("#auditor-wrapper").length > 0) {
			tabPageController.active(me.entity().tab_id);
		} else {
			tabPageController.newTab(name || '审核',
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