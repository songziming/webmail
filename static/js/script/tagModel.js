define(function (require, exports, module) {
//	var $ = require("jquery");
	var md5 = require("md5");
//	var headerController = (require("header")).prototype.entity;
	var is = require("is");

	var tag = function () {

		this.name = null;
		this.inbox = {};
		this.outbox = {};
		this.getPath = '/tag/all';
		this.addPath = '/tag/add';
		this.updatePath = '/inbox/update';
		this.delPath = '/tag/del';
		this.init();
		return this;
	};

	tag.prototype = {
		init: function () {
			var me = this;
		}
	};

	var t = new tag();

	tag.entity = function () {
		return t;
	};

	tag.prototype.all = function (callback, errorCallback) {
		$.get(t.getPath,'json')
			.done(function (res) {
				callback && callback(res);
			}).
			error(function (e) {
				errorCallback && errorCallback(e);
			});
	};
	tag.prototype.list = function(callback,ifFresh) {
		var me = this;
		if(me.dataList == undefined || ifFresh){
			me.all(function(res){
				me.dataList = {tags:res.tags};
				callback&&callback(me.dataList);

			})
		}else {
			callback && callback(me.dataList);
		}
	};

	tag.prototype.add = function (data, callback, errorCallback) {
		$.post(t.addPath, data, 'json')
			.done(function (res) {
				callback && callback(res);
			}).
			error(function (e) {
				errorCallback && errorCallback(e);
			});
	};

	tag.prototype.stick = function(data,callback){
		$.post(t.updatePath,data,'json').
			done(function(res) {
				callback && callback(res);
			});
	};

	tag.prototype.del = function(data,callback){
		$.post(t.delPath,data,'json').
			done(function(res) {
				callback && callback(res);
			});
	};

	//绑定变量
	tag.entity.bind(t);

	module.exports = t;
});