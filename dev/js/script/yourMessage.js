define(function (require, exports, module) {
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var yourMessage = function () {
		this.listPath = '/message/receive';
		this.loadPath = '';
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
					if(tar.hasClass("load-more")){
						return;
					}
					var title = tar.children(".time").html();
					var content = tar.children(".content").html();
					ALERT(title, content, function () {
						me.removeMsg(tar);
					});
				}else if(e.target.parentNode.classList.contains("msg")){
					$(e.target.parentNode).trigger("click");
				}
			});
			$(".header .user-block .user-menu").click(function(){
				if($("#your-messages").hasClass("show")){
					me.hide();
				}else {
					me.show();
				}
			});
		},
		autoFresh: function () {
			var me = this;
			var s = setInterval(function(){
				me.receive(null, me.latest || null, function (res) {
					var html = juicer(me.itemTemplate, res);
					$(html).insertBefore("#your-messages .list-wrapper .msg:first-child");
				});
			},30000);
		},
		list: function () {
			var me = this;
			me.receive(null, me.latest || null, function (res) {
				if(res.messages.length > 0){
					me.show();
				}
				var html = juicer(me.itemTemplate, res);
				$(html).insertBefore("#your-messages .list-wrapper .msg:first-child");
			});
		},
		show: function () {
			var me = this;
			$("#your-messages").addClass("show");
		},
		hide: function () {
			var me = this;
			$("#your-messages").removeClass("show");
		},
		receive: function (oldMessage, lastMessage, callback) {
			var me = this;
			var data = {
				limit: 20
			};

			if (oldMessage != null || oldMessage != undefined) {
				data.oldMessage = oldMessage;
			}
			if (lastMessage != null || lastMessage != undefined) {
				data.lastMessage = lastMessage;
			}

			$.post(me.listPath, data, 'json').done(function (res) {

				if (res.status == 1) {
					res.messages = res.messages.reverse();
					me.latest = res.latest = res.messages[ 0 ] && res.messages[ 0 ].id;
					me.old = res.old = res.messages[ 0 ] && res.messages[ res.messages.length - 1 ].id;
					callback && callback(res);
				} else {
					ALERT('提示', res.msg);
				}
			});
		},
		removeMsg: function (tar) {
			tar && tar.addClass("remove");
			var s = setTimeout(function () {
				tar.remove();
				clearTimeout(s);
			}, 400);
		}

	};
	module.exports = yourMessage;
});