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

	function dispatchController() {
//		this.init();
		return this;
	}

	dispatchController.prototype = {
		init: function (mail_id) {

			var me = this;

			me.listWrapper = $("#dispatch-wrapper .left-mail-list");
			me.listToggleBtn = $("#dispatch-wrapper .mail-list-toggle-btn");
			me.list = $('#dispatch-wrapper .left-mail-list .mails-wrapper').eq(0);
			me.rightDetail = $("#dispatch-wrapper .right-detail-section").eq(0);
			me.filterBlock = $("#dispatch-mail-filter");

			me.bind();
			me.addFilter();
			me.loadList();
			me.autoFresh();
			if (mail_id != undefined) {
				me.showDetail(mail_id);
			}

		},
		loadTemplate: function () {
			var me = this;

			me.listItemTemplate = tmp("mail-list-item");
			me.detailTemplate = tmp("dispatch-mail-detail");
			me.pageTemplate = tmp("dispatch");
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
		addSelectNumber: function () {
			var me = this;
			me.selectOr = $("#select-dispatch-number");
			user.list(function (list) {
				var html = juicer(me.userListTemplate, list);
				me.selectOr.html(html).select2();
				var select = me.selectOr.siblings(".select2-container").eq(0);
				var width = select.css("width");
				select.css({"width": "auto", "min-width": width});
			});
		},
		addTagList: function () {
			var me = this;
			me.selectOr2 = $("#select-tag-to-stick");
			var tagArr = me.rightDetail.attr("data-tags");
			if(tagArr!=""){
				tagArr = tagArr.split(",");
				tagArr.splice(-1);
				for(var i in tagArr){
					tagArr[i] = parseInt(tagArr[i]);
				}
			}

			tag.list(function (tagList) {
				var list = tagList.tags.concat();
				for(var j in tagArr){
					if(tagArr.indexOf(list[j ].id)!= -1){
						list[j ].selected = 1;
					}
				}

				var html = juicer(me.tagListTemplate, {tags:list});
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
			me.receiverWrapper = $("#dispatch-wrapper .receiver-wrapper");
			me.dispatchBtn = $("#dispatch-wrapper #dispatch-commit");
			me.timePicker = $("#deadline-picker");
			me.setDeadLineBtn = $("#set-deadline-btn");

			me.receiverWrapper.unbind('click').on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass("icon-add-receiver")) {
					me.addReceiver(tar.parent());
				} else if (tar.hasClass("mail-receiver")) {
					me.addReceiver(tar);
				} else if (e.target.id == "dispatch-commit") {
					me.commitDispatch();
				} else if (e.target.id == "stick-tag-commit") {
					me.commitTag();
				}
			});
			var d  = new Date();
			var startDate = d.toDateString();
			me.timePicker.datetimepicker({
				startDate : startDate,
				lang: 'zh'
			});

			me.setDeadLineBtn.click(function(){
				me.setDeadLine();
			});


		},
		addReceiver: function (tar) {
			var me = this;
			tar.removeClass("add");
			$(me.newReceiverTemplate).insertBefore(me.dispatchBtn);
		},

		addOne: function (data, ifRender) {
			var me = this;
			var html = me.listItemTemplate;
			ifRender && $(html).insertBefore('#dispatch-wrapper .left-mail-list .mails-wrapper .mail:first-child');
			return juicer(html, {'mail': data});
		},
		setDeadLine:function(){
			var me = this;
			var deadline = me.timePicker.val();
			var mail_id = me.setDeadLineBtn.attr("data-id");
			mail.update({
				mail: mail_id,
				deadline: deadline
			},function(res){
				if(res.status == 1){
					alert("设置成功！");
				}
			});
		},
		loadList: function (ifFresh, start) {
			var me = this;
			var filter = me.filterBlock.select2("val");

			var zeroIndex = filter.indexOf("0");
			if (zeroIndex != -1) {
				filter.splice(zeroIndex, 1);
			}
			mail.inboxList(start, filter, function (res) {
				if (res.status == 1) {
					me.listWrapper.attr("data-count", res.count);

					var html = [];

					res.mails.forEach(function (i) {
						html.push(me.addOne(i, false));
					});
					html = html.reverse();
					html = html.join('');
					if (ifFresh == true) {
						$("#dispatch-wrapper .mails-wrapper .mail:not('.load-more')").remove();
					}
					$(html).insertBefore('#dispatch-wrapper .mails-wrapper .mail:first-child');

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
					me.bindDetail();
					me.addSelectNumber();
					me.addTagList();
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

			mail.dispatch(data,
				function (res) {
					if (res.status == 1) {
						alert("分派成功");
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
						alert("分派成功");
					}
				},
				function (error) {

				});
		},
		register: function () {
			var me = this;
			if (dispatchController.prototype.entities == undefined) {
				dispatchController.prototype.entities = [];
			}
			dispatchController.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		},
		autoFresh: function () {
			var me = this;
			me.timeer = setInterval(function () {
				var start = me.listWrapper.attr("data-count");
				me.loadList(false, start);
			}, 5000);
		}

	};

	var d = new dispatchController();

	dispatchController.prototype.entity = function (arg) {
		if (!arg) {
			var res = dispatchController.prototype.entities == undefined ? [ null ] : dispatchController.prototype.entities;
			return res[ res.length - 1 ] || null;
		}
		else if (arg.entity != undefined) {
			if (dispatchController.prototype.entities == undefined) {
				dispatchController.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
			dispatchController.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return dispatchController.prototype.entities[ arg.tab_id ];
		}
	};

	dispatchController.prototype.showPage = function (name, mail_id) {
		var me = this;
		var openedPage = me.entity();
		if (openedPage != null && $("#dispatch-wrapper").length > 0) {
			tabPageController.active(me.entity().tab_id);
		} else {
			tabPageController.newTab(name || '分发',
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