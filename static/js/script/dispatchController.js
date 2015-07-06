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

	function dispatchController() {
//		this.init();
		return this;
	}

	dispatchController.prototype = {
		init: function (tab_id) {

			var me = this;

			me.listWrapper = $("#dispatch-wrapper .left-mail-list");
			me.listToggleBtn = $("#dispatch-wrapper .mail-list-toggle-btn");
			me.list = $('#dispatch-wrapper .left-mail-list .mails-wrapper').eq(0);
			me.rightDetail = $("#dispatch-wrapper .right-detail-section").eq(0);

			me.bind();
			me.loadList();
			me.autoFresh();
		},
		loadTemplate: function () {
			var me = this;

			me.listItemTemplate = tmp("mail-list-item");
			me.detailTemplate = tmp("dispatch-mail-detail");
			me.pageTemplate = tmp("dispatch");
			me.userListTemplate = tmp('user-list');
			me.newReceiverTemplate = tmp("mail-receiver");
		},
		render: function () {

			var me = this;
			me.loadTemplate();

			me.wrapper = $("#tab-page-" + me.entity().tab_id);
			me.wrapper.html(me.pageTemplate);
			me.init();

		},
		addSelectNumber:function(){
			var me = this;
			me.selectOr = $("#select-dispatch-number");
			user.list(function(list){
				var html = juicer(me.userListTemplate,list);
				me.selectOr.html(html).select2();
				var select = me.selectOr.siblings(".select2-container").eq(0);
				var width = select.css("width");
				select.css({"width":"auto","min-width":width});
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
					me.showDetail(id);
				} else if (tar.hasClass("mail")) {

				} else {
					var t = tar.parents(".mail").eq(0);
					var id = t.attr("data-id");
					me.showDetail(id);

				}
			});

		},
		bindDetail: function () {
			var me = this;
			me.receiverWrapper = $("#dispatch-wrapper .receiver-wrapper");
			me.dispatchBtn = $("#dispatch-wrapper #dispatch-commit");

			me.receiverWrapper.unbind('click').on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass("icon-add-receiver")) {
					me.addReceiver(tar.parent());
				} else if (tar.hasClass("mail-receiver")) {
					me.addReceiver(tar);
				} else if (e.target.id == "dispatch-commit") {
					me.commitDispatch();
				}
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
					$(html).insertBefore('#dispatch-wrapper .left-mail-list .mails-wrapper .mail:first-child');

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
					me.rightDetail.html(html);
					me.mail_id = mail_id;
					me.bindDetail();
					me.addSelectNumber();
				}
				else {
				}
			});

		},
		commitDispatch: function () {
			var me = this;
//			var result = [];
//			$("#dispatch-wrapper .mail-receiver .txt").each(function(index,elem){
//				var temp = $(elem).html().trim();
//				if(temp.length>0) {
//					result.push(temp);
//				}
//			});
			var result = me.selectOr.select2("val");
			console.log(result);
			alert(result);
			var mail_id = me.mail_id;

			data = {
				mail: mail_id,
				consumer: result
			};

			mail.dispatch(data,
				function (res) {
					if(res.status==1){
						alert("分派成功");
					}
				},
				function (error) {

				})
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
				me.loadList(start);
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

	dispatchController.prototype.showPage = function () {
		var me = this;
		var openedPage = me.entity();
		if (openedPage != null && $("#dispatch-wrapper").length > 0) {
			tabPageController.active(me.entity().tab_id);
		} else {
			tabPageController.newTab('分发',
				function (tab_id) {
					me.entity({
						tab_id: tab_id,
						entity: me
					});
					me.render();
				});
		}

	};

	module.exports = d;
});