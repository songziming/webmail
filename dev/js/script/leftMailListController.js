/**
 * Created by wungcq on 15/6/29.
 */
define(function (require, exports, module) {
	var $ = require("jquery");

	function mailListController() {
		this.init();
		return this;
	}

	mailListController.prototype = {
		init: function(){
			var me  = this;

			me.listWrapper = $("#left-mail-list");
			me.listToggleBtn =  $("#mail-list-toggle-btn");

			me.bind();
		},
		bind: function(){
			var me = this;
			me.listToggleBtn.unbind('click').click(function(){
				if(me.listWrapper.hasClass("show")) {
					me.listWrapper.addClass("hide").removeClass("show");
					me.listToggleBtn.attr("title","展开列表");
				}else {
					if(me.listWrapper.hasClass("hide")) {
						me.listWrapper.removeClass("hide").addClass("show");
						me.listToggleBtn.attr("title","收起列表");
					}
				}
			});
		}
	};


	module.exports = mailListController;
});