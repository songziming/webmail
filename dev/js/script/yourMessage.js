define(function (require, exports, module) {
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var yourMessage = function () {
		this.listPath = '';
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
//			me.autoFresh();
		},
		render: function () {
			var me = this;
			$("body").append(me.wrapperTemplate);

		},
		autoFresh : function() {
			var me = this;
			var str = "    Highcharts出色的图表性能得到了越来越多的使用者的认可，然而在中文环境中，Highcharts相关资源并不多，目前还没有比较完善的的系列教程。鉴于此，Highchars中文网管理团队决定编写一套详细的、完善的入门教程，帮助大家学习和使用Highcharts。";

			var s = setInterval(function(){
				var rand = parseInt(Math.random()*100);
				var _str = str.slice(0,rand);
				var data = {
					msg: {
						"time":"系统信息:2015-7-9",
						"content": _str
					}
				};
				var html = juicer(me.itemTemplate, data);
				$(html).insertBefore("#your-messages .list-wrapper .msg:first-child");
			},1000);
		},
		list: function () {
			var me = this;
		}
	};
	module.exports = yourMessage;
});