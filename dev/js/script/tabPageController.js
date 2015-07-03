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
			me.tabWrapper.on('click',function(e){
				var doIt = function(t){
					e.preventDefault();
					if(t.hasClass("active")){
						//do nothing
					}else {
						$(".tab-wrapper .tab.active").removeClass("active");
						var id = t.addClass("active").attr("id").split("tab-")[1];
						me.setTabPageActive(id);
					}
				};
				var tar =  $(e.target);
				if(tar.hasClass("tab")) {
					doIt(tar);
				}else if(tar.hasClass("name")){
					doIt(tar.parent());
				}else if(tar.hasClass("icon-close")){
					var id = tar.parent().attr("id").split("tab-")[1];
					me.removeTabPage(id);
				}

			});
		},
		insertTab: function(tabName){
			var me = this;
			var name = tabName||me.tabName;
			var tmp_tab = tmp("tab");
			var id = me.tabNum();
			var tab_txt = juicer(tmp_tab,{name:name,id:'tab-'+id});
			me.tabWrapper.append(tab_txt);
			me.insertTabPage(id);
		},
		insertTabPage: function(id){
			var tmp_TabPage = tmp("tab-page");
			var tabPageId = "tab-page-"+id;
			var tabPage_txt = juicer(tmp_TabPage,{id:tabPageId});
			$(".index-page").append(tabPage_txt);
			$(".tab-page.active").removeClass("active");
			$("#"+tabPageId).addClass("active");
		},
		setTabActive:function(id){
			$("#tab-"+id).attr("class","tab active");
		},
		setTabPageActive: function(id){
			var tabPage = $("#tab-page-"+id);
			$(".tab-page.active").removeClass("active");
			tabPage.addClass("active");
		},
		removeTabPage : function(id){
			var me = this;
			var num = me.tabNum();
			if(parseInt(num)>1){
				me.setTabActive(num-1);
				me.setTabPageActive(num-1);
			}
			$("#tab-page-"+id).remove();
			$("#tab-"+id).remove();

		},
		tabNum : function(){
			var num = $(".tab-wrapper .tab").length;
			return num;
		}
	};


	tabPageController._init = function() {
	};


	module.exports = tabPageController;
});