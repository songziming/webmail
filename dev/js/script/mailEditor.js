/**
 * Created by wungcq on 15/7/3.
 */

define(function (require, exports, module) {
	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var mail = require("mail");
	var tabPageController = require("tabPageController");

	function mailEditor(userData) {
		this.init(userData);
		return this;
	}

	mailEditor.prototype = {
		entities: [],//tab_id作为标识
		init: function (mailData) {
			var me = this;
			if (mailData) {
				me.mailData = mailData;
				me.register();
			}
		},

		register: function () {
			var me = this;

			if (mailEditor.prototype.entities == undefined) {
				mailEditor.prototype.entities = [];
			}
			mailEditor.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		},

		render: function (tab_id) {
			var me = this;
			var txt = tmp("editor-page");
			var page = $("#tab-page-" + tab_id);
			var html = juicer(txt, me.mailData);
			if (page.attr("rendered") == undefined) {
				page.html(html);
				page.attr("rendered", 1);
			}
			me.bindSooner(tab_id);

		},
		bindSooner: function (tab_id) {
			var me = this;
			me.sendBtn = $("#send-mail-" + tab_id);
			me.sendBtn.click(function (e) {
				me.sendMail(tab_id);
			});
		},
		bindDetail: function (tab_id) {
			var me = this;
			me.tagWrapper = $("#tab-page-"+tab_id+" .tag-wrapper");
			me.tagBtn = $("#tab-page-"+tab_id+" #tag-commit");

			me.tagWrapper.unbind('click').on('click', function (e) {
				var tar = $(e.target);
				if (tar.hasClass("icon-add-tag")) {
					me.addTag(tar.parent());
				} else if (tar.hasClass("mail-tag")) {
					me.addTag(tar);
				} else if (e.target.id == "tag-commit") {
					me.commitTag();
				}
			});

		},
		addTag: function (tar) {
			var me = this;
			tar.removeClass("add");
			me.newTagTemplate = tmp("mail-tag");
			$(me.newTagTemplate).insertBefore(me.tagBtn);
		},
		commitTag: function () {
			var me = this;
			var result = [];
			$("#tab-page-"+me.mailData.tab_id+" .mail-tag .txt").each(function(index,elem){
				var temp = $(elem).html().trim();
				if(temp.length>0) {
					result.push(temp);
				}
			});
			var mail_id = me.mailData.mail.id;

			data = {
				mail: mail_id,
				tags: result
			};

			mail.update(data,
				function (res) {
					if(res.status==1){
						alert('添加成功!');
					}
				});
		},
		bindTextAreaListener: function (tab_id) {
			var textareaHeight = 0;
			var markedViewHeight = 0;
			var textarea = $('#tab-page-' + tab_id + ' .mail-content').eq(0);
			var markdownView = textarea.siblings(".marked-view").eq(0);

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

		},
		sendMail: function (tab_id) {
			var me = this;
			var send_Success = function(){

			};
			var mail_to = $("#mail-to-"+tab_id).attr("data-mail-id").trim();
			var title = $("#mail-title-"+tab_id).html().trim();
			var text = $("#mail-textarea-"+tab_id).html();
			var html = $("#mail-marked-"+tab_id).html();
			var data = {
				"title":title,
				"urgent": 0,
				"html": html,
				"text" : text,
				"to": mail_to
			};
			mail.sendMail(data,function(res){
				if(res.status==1) {
					alert("success!");
				}
			},function(e){

			});


		}
	};

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

	mailEditor.prototype.newEditor = function (mailData) {
		var me = this;
		var mail_data = mailData || '未选择';

		tabPageController.newTab('处理:' + mail_data.mail.title.slice(0,3),
			function (tab_id) {
				var newEditor = new mailEditor(mail_data);
				me.entity({
					tab_id: tab_id,
					entity: newEditor
				});
				me.mailData = mail_data;
				me.mailData.tab_id = tab_id;
				me.render(tab_id);
				me.bindTextAreaListener(tab_id);
				me.bindDetail(tab_id);

			});
	};

	module.exports = m;
});