/**
 * Created by wungcq on 15/6/29.
 */
define(function (require, exports, module) {
	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");

	function tabPageController() {
		this.init();


		return this;
	}

	tabPageController.prototype = {
		init: function(){
			var me  = this;
			this.baseZIndex = 1000;
			this.tabWrapper = $(".index-page>.tab-wrapper").eq(0);
			me.bind();
			me.insertTab("233333");
		},
		bind: function(){
			var me = this;
		},
		insertTab: function(tabName){
			var me = this;
			var name = tabName||me.tabName;
			var tmp_tab = tmp("tab");
			var id = me.tabId();
			var tab_txt = juicer(tmp_tab,{name:name,id:id});
			me.tabWrapper.append(tab_txt);
			me.insertTabPage(id);
		},
		insertTabPage: function(id){
			var tmp_TabPage = tmp("tab-page");
			var tabPageId = "tab-page-"+id;
			var tabPage_txt = juicer(tmp_TabPage,{id:tabPageId});
			$(".index-page").append(tabPage_txt);
			$(".tab-page .active").removeClass("active");
			$("#"+tabPageId).addClass("active");
		},
		tabId : function(){
			var num = $(".tab-wrapper .tab").length;
			return num;
		}
	};


	tabPageController._init = function() {
	};


	module.exports = tabPageController;
});