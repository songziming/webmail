define(function (require, exports, module) {
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var yourMessage = function () {
		this.listPath = '/message/receive';
		this.setReadPath = '/message/read';
		this.init();
		return this;
	};

	yourMessage.prototype = {
		init: function () {
			var me = this;
			me.wrapperTemplate = tmp('msg-wrapper');
			me.itemTemplate = tmp('msg-list-item');
			me.render();
			me.bind();
			me.list();
			me.autoFresh();

		},
		render: function () {
			var me = this;
			$("body").append(me.wrapperTemplate);
		},
		bind: function () {
			var me = this;
			$("#your-messages").on("click", function (e) {
				if (e.target.classList.contains("msg")) {
					var tar = $(e.target);
					if (tar.hasClass("load-more")) {
						return;
					}
					var title = tar.children(".title").html();
					var content = tar.children(".content").html();
					var id = tar.attr("data-id");
					me.setRead(id, function () {
						ALERT(title, content, function () {
							me.removeMsg(tar);
						});
					});

				} else if (e.target.parentNode.classList.contains("msg")) {
					$(e.target.parentNode).trigger("click");
				}
			});
			$("#your-messages").on("blur", function () {
				me.hide();
			});
			$(".header .user-block .user-menu").click(function () {
				if ($("#your-messages").hasClass("show")) {
					me.hide();
				} else {
					me.show();
				}
			});
		},
		autoFresh: function () {
			var me = this;
			var s = setInterval(function () {
				me.receive(null, me.latest || null, function (res) {
					var html = juicer(me.itemTemplate, res);
					$(html).insertBefore("#your-messages .list-wrapper .msg:first-child");
					var count = me.showCount();
					count>0 && me.show();
				});
			}, 10000);
		},
		list: function () {
			var me = this;
			me.receive(null, me.latest || null, function (res) {
				if (res.messages.length > 0) {
					me.show();
				}
				var html = juicer(me.itemTemplate, res);
				$(html).insertBefore("#your-messages .list-wrapper .msg:first-child");
				me.showCount();
			});
		},
		show: function () {
			var me = this;
			$("#your-messages").addClass("show");
			$("#your-messages").focus();
		},
		hide: function () {
			var me = this;
			$("#your-messages").removeClass("show");
		},
		receive: function (oldMessage, lastMessage, callback) {
			var me = this;
			var data = {
				limit: 100
			};

			if (oldMessage != null || oldMessage != undefined) {
				data.oldMessage = oldMessage;
			}
			if (lastMessage != null || lastMessage != undefined) {
				data.lastMessage = lastMessage;
			}

			$.post(me.listPath, data, 'json').done(function (res) {

				if (res.status == 1) {
					if (res.messages.length == 0) {
						return;
					}
					var len = res.messages.length;
					me.latest = res.latest = res.messages[ 0 ] && res.messages[ 0 ].id;
					me.old = res.old = res.messages[ 0 ] && res.messages[ res.messages.length - 1 ].id;
					res.messages = res.messages.reverse();
					callback && callback(res);
				} else {
					ALERT('提示', res.msg);
				}
			});
		},
		removeMsg: function (tar) {
			var me = this;
			tar && tar.addClass("remove");
			var s = setTimeout(function () {
				tar.remove();
				me.showCount();
				clearTimeout(s);
			}, 240);
		},
		setRead: function (id, callback) {
			var me = this;
			var idstr = [ parseInt(id) ];
			$.post(me.setReadPath, {messages: JSON.stringify(idstr)}, 'json').done(function (res) {
				if (res.status == 1) {
					callback && callback(res);
				} else {
					ALERT('提醒', res.msg);
				}
			});
		},
		showCount: function () {
			var count = $("#your-messages .msg:not('.load-more')").length;
			var res = count;
			if (count == 0) {
				count = "没有新消息";
			}
			$(".header .user-block .user-menu").html("(" + count + ")");
			return res;
		}

	};
	module.exports = yourMessage;
});