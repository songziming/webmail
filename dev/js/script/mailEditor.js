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
			var html = juicer(txt, {user: me.user});
			if (page.attr("rendered") == undefined) {
				page.html(html);
				page.attr("rendered", 1);
			}

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
				markedViewHeight = parseInt(markdownView.get(0).scrollHeight);;

			}).scroll(function (eve) {
				var top = textarea.scrollTop()/textareaHeight * markedViewHeight;
				markdownView.scrollTop(top);
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

	mailEditor.prototype.newEditor = function (user) {
		var me = this;
		var user = user || '未选择';

		tabPageController.newTab('写给:' + user,
			function (tab_id) {
				var newEditor = new mailEditor(user);
				me.entity({
					tab_id: tab_id,
					entity: newEditor
				});
				me.render(tab_id);
				me.bindTextAreaListener(tab_id);

			});
	};

	module.exports = m;
});