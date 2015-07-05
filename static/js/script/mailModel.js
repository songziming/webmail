define(function (require, exports, module) {
	var $ = require("jquery");
	var md5 = require("md5");
//	var headerController = (require("header")).prototype.entity;
	var is = require("is");

	var mail = function () {

		this.name = null;
		this.inbox = {};
		this.outbox = {};
		this.inbox.listPath = '/inbox/list';
		this.inbox.detailPath = '/inbox/detail';
		this.inbox.dispatchPath = '/inbox/dispatch';
		this.inbox.handlePath = '/inbox/handle';
		this.outbox.listPath = '/outbox/list';
		this.outbox.detailPath = '/outbox/detail';
		this.outbox.auditPath = '/outbox/audit';
		this.init();
		return this;
	};

	mail.prototype = {
		init: function () {
			var me = this;
		}
	};

	var u = new mail();

	mail.entity = function () {
		return u;
	};

	mail.inboxList = function (start, callback, errorCallback) {
		$.post(u.inbox.listPath,
			{
				"offset": start || 0,
				"limit": 20
			},
			'json'
		)
			.done(function (res) {
				callback && callback(res);
			})
			.error(function (e) {
				errorCallback && errorCallback(e);
			});
	};
	mail.inboxMailDetail = function (id, callback, errorCallback) {
		$.post(u.inbox.detailPath,
			{
				mail: id
			},
			'json')
			.done(function (res) {
				callback && callback(res);
			})
			.error(function (e) {
				errorCallback && errorCallback(e);
			});
	};

	mail.dispatch = function (data, callback, errorCallback) {
		$.post(u.inbox.dispatchPath,
			data,
			'json')
			.done(function (res) {
				callback && callback(res);
			})
			.error(function (e) {
				errorCallback && errorCallback(e);
			});
	};

	mail.sendMail = function (data, callback, errorCallback) {
		$.post(u.inbox.handlePath, data, 'json')
			.done(function (res) {
				callback && callback(res);
			}).
			error(function (e) {
				errorCallback && errorCallback(e);
			})
	};

	//绑定变量
	mail.entity.bind(u);

	module.exports = mail;
});