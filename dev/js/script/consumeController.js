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
			me.loadList();
			me.autoFresh();
			if (mail_id != undefined) {
				me.showDetail(mail_id);
			}
			user.list(function(list){
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
				select.css({"width": "auto", "min-width": width});

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
				select.css({"width": "auto", "min-width": width});

				var html3 = juicer(me.auditorListTemplate, list);
				me.selectOr3.html(html3).select2();
				var select3 = me.selectOr3.siblings(".select2-container").eq(0);
				var width3 = select3.css("width");
				select3.css({"width": "auto", "min-width": width3});
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
		bindDetail: function (mail_id) {
			var me = this;
			me.receiverWrapper = $("#consume-wrapper .receiver-wrapper");
			me.consumeBtn = $("#consume-wrapper #consume-commit");
			me.commitBtn = $("#consume-commit-"+mail_id);
			me.urgentBtn = $("#urgent-commit-"+mail_id);
			me.transBtn = $("#mail-trans-commit-"+mail_id);



			me.commitBtn.click(function(e){
				me.sendMail();
			});

			me.urgentBtn.click(function(e){
				me.sendMail()
			});

			me.transBtn.click(function(){
				me.transMail();
			});

			$("#mail-return-"+mail_id).click(function(){
				me.returnMail();
			});
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
			var title =me.commitBtn.attr("data-title").trim();
			var mail_id = me.commitBtn.attr("data-id").trim();
			var text = me.textArea.val();
			var html = me.markdownView.html();
			var auditor_id = me.selectOr3.select2("val")[0];
			var data = {
				"title":'回复：'+title,
				"urgent": isUrgent||0,
				"html": html,
				"text" : text,
				"to": mail_to,
				"replyToId": parseInt(mail_id),
				"auditorId": auditor_id
			};
			mail.sendMail(data,function(res){
				if(res.status==1) {
					alert("success!");
				}
			});
		},
		transMail: function(){
			var me = this;
			var mail_id = me.transBtn.attr("data-id");
			var to = me.selectOr.select2("val");
			to = to[0];
			var data= {
				mail: mail_id,
				assignee : to
			};
			mail.trans(data,function(res){
				if(res.status == 1){
					alert("转发成功，你已经失去了这封邮件的处理权");
				}
			});
		},
		returnMail: function(){
			var me  = this;
			var mail_id = me.transBtn.attr("data-id");
			var data = {mail: mail_id};
			mail.returnMail(data,function(res){
				if(res.status == 1){
					alert("已成功回退");
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
					me.bindTextAreaListener(mail_id);
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
				var start = me.listWrapper.attr("data-count");
				me.loadList(false, start);
			}, 5000);
		},

		//文本绑定
		bindTextAreaListener: function (mail_id) {
			var me = this;
			var textareaHeight = 0;
			var markedViewHeight = 0;
			var textarea = $('#mail-textarea-'+mail_id);
			var markdownView = $('#mail-marked-'+mail_id);
			me.textArea = textarea;
			me.markdownView = markdownView;

			textarea.keydown(function (eve) {
				if (eve.target != this)
					return;
				if (eve.keyCode == 13)
					last_blanks = getCurrentLineBlanks(this);
				else if (eve.keyCode == 9) {
					eve.preventDefault();
					insertAtCursor(this, "\n");
					this.returnValue = false;
				}
			}).keyup(function (eve) {
				if (eve.target == this && eve.keyCode == 13) {
				}

				var text = textarea.val();
				var previewText = marked(text);
				textareaHeight = parseInt(textarea.get(0).scrollHeight);
				markdownView.html(previewText);
				markedViewHeight = parseInt(markdownView.get(0).scrollHeight);


			}).scroll(function (eve) {
				var top = textarea.scrollTop() / textareaHeight * markedViewHeight;
				markdownView.scrollTop(top);
			});

		}

	};

	var d = new consumeController();

	function insertAtCursor(obj, txt) {
		obj.focus();
		//IE support
		if (document.selection) {
			sel = document.selection.createRange();
			sel.text = txt;
		}
		//MOZILLA/NETSCAPE support
		else {
			var startPos = obj.selectionStart;
			var scrollTop = obj.scrollTop;
			var endPos = obj.selectionEnd;
			obj.value = obj.value.substring(0, startPos) + txt + obj.value.substring(endPos, obj.value.length);
			startPos += txt.length;
			obj.setSelectionRange(startPos, startPos);
			obj.scrollTop = scrollTop;
		}
	}

	function getCaretPos(ctrl) {
		var caretPos = 0;
		if (document.selection) {
			// IE Support
			var range = document.selection.createRange();
			// We'll use this as a 'dummy'
			var stored_range = range.duplicate();
			// Select all text
			stored_range.moveToElementText(ctrl);
			// Now move 'dummy' end point to end point of original range
			stored_range.setEndPoint('EndToEnd', range);
			// Now we can calculate start and end points
			ctrl.selectionStart = stored_range.text.length - range.text.length;
			ctrl.selectionEnd = ctrl.selectionStart + range.text.length;
			caretPos = ctrl.selectionStart;
		} else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		// Firefox support
			caretPos = ctrl.selectionStart;
		return (caretPos);
	}

	function getCurrentLineBlanks(obj) {
		var pos = getCaretPos(obj);
		var str = obj.value;
		var i = pos - 1;
		while (i >= 0) {
			if (str.charAt(i) == '\n')
				break;
			i--;
		}
		i++;
		var blanks = "";
		while (i < str.length) {
			var c = str.charAt(i);
			if (c == ' ' || c == '\t')
				blanks += c;
			else
				break;
			i++;
		}
		return blanks;
	}

	function setCursorPos(inputObj, pos) {

		if (navigator.userAgent.indexOf("MSIE") > -1) {
			var range = document.selection.createRange();
			var textRange = inpObj.createTextRange();
			textRange.moveStart('character', pos);
			textRange.collapse();
			textRange.select();
		} else {
			inputObj.setSelectionRange(n, n);
		}
	}

	function getCursorPos(inputObj) {
		if (navigator.userAgent.indexOf("MSIE") > -1) { // IE
			var range = document.selection.createRange();
			range.text = '';
			range.setEndPoint('StartToStart', inpObj.createTextRange());
			return range.text.length;
		} else {
			return inputObj.selectionStart;
		}
	}

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