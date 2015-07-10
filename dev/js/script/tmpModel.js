define(function (require, exports, module) {
//	var $ = require("jquery");
	var md5 = require("md5");
//	var headerController = (require("header")).prototype.entity;
	var is = require("is");

	var tmp = function () {

		this.name = null;
		this.getPath = '/tmp/all';
		this.addPath = '/tmp/add';
		this.updatePath = '/inbox/update';
		this.delPath = '/tmp/del';
		this.init();
		return this;
	};

	tmp.prototype = {
		init: function () {
			var me = this;
		}
	};

	var t = new tmp();

	tmp.entity = function () {
		return t;
	};

	tmp.prototype.all = function (callback, errorCallback) {
		$.get(t.getPath,'json')
			.done(function (res) {
				callback && callback(res);
			}).
			error(function (e) {
				errorCallback && errorCallback(e);
			});
	};
	tmp.prototype.list = function(callback,ifFresh) {
		var me = this;
		if(me.dataList == undefined || ifFresh){
			me.all(function(res){
				me.dataList = {tmps:res.tmps};
				callback&&callback(me.dataList);

			})
		}else {
			callback && callback(me.dataList);
		}
	};

	tmp.prototype.add = function (data, callback, errorCallback) {
		$.post(t.addPath, data, 'json')
			.done(function (res) {
				callback && callback(res);
			}).
			error(function (e) {
				errorCallback && errorCallback(e);
			});
	};

	tmp.prototype.stick = function(data,callback){
		$.post(t.updatePath,data,'json').
			done(function(res) {
				callback && callback(res);
			});
	};

	tmp.prototype.del = function(data,callback){
		$.post(t.delPath,data,'json').
			done(function(res) {
				callback && callback(res);
			});
	};

	//绑定变量
	tmp.entity.bind(t);

	module.exports = t;
});