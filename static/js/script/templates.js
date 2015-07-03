/**
 * Created by wungcq on 15/6/29.
 */
/**
 * Created by wungcq on 15/6/29.
 */
/**
 * Created by wungcq on 15/6/29.
 */
define(function (require, exports, module) {
	var $ = require("jquery");
	var tmp = function(){
		this.init();
		return this;
	};

	tmp.prototype = {
		init : function(){
			var me = this;
			me.frameDocument = $("#template").get(0).contentWindow.document;
		},
		find : function(name){
			var me = this;
			var res = $(me.frameDocument).find("#tmp-"+name).eq(0);
			res = (res!=[]) ? res.html().trim() : '';
			return res;
		}
	};


	var find = function(name){
		var tmpEntity = new tmp();
		return tmpEntity.find(name);
	};

	module.exports = find;

});