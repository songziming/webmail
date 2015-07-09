define(function (require, exports, module) {
//	var $ = require("jquery");
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
		this.inbox.transPath = '/inbox/trans';
		this.inbox.returnPath = '/inbox/return';
		this.inbox.hurryPath = '/inbox/hurry';

		this.outbox.listPath = '/outbox/list';
		this.outbox.detailPath = '/outbox/detail';
		this.outbox.auditPath = '/outbox/audit';
		this.outbox.editPath = '/outbox/edit';
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

	mail.inboxList = function (latest, filter, callback, errorCallback) {
		var data = {
			"lastMail": latest || 0,
			"limit": 20
		};
		if (filter != undefined && filter.length > 0) {
			data.tags = JSON.stringify(filter);
		}
		$.post(u.inbox.listPath,
			data,
			'json'
		)
			.done(function (res) {
				res.mails = res.mails.reverse();
				res.old = res.mails[ 0 ] && res.mails[ 0 ].id;
				res.latest = res.mails[ 0 ] && res.mails[res.mails.length -1 ].id;

				callback && callback(res);
			})
			.error(function (e) {
				errorCallback && errorCallback(e);
			});
	};
	mail.inboxLoadMore  = function(oldMail, filter, callback, errorCallback){
		var data = {
			"oldMail": oldMail,
			"limit": 20
		};
		if (filter != undefined && filter.length > 0) {
			data.tags = JSON.stringify(filter);
		}
		$.post(u.inbox.listPath,
			data,
			'json'
		)
			.done(function (res) {
				res.mails = res.mails.reverse();
				res.old = res.mails[ 0 ] && res.mails[ 0 ].id;
				res.latest = res.mails[ 0 ] && res.mails[res.mails.length -1 ].id;
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

	mail.update = function (data, callback) {
		$.post('/inbox/update', data, 'json').
			done(function (res) {
				callback && callback(res);
			});

	};

	mail.trans = function (data, callback) {
		$.post(u.inbox.transPath,
			data,
			'json').
			done(function (res) {
				callback && callback(res);
			});
	};
	mail.returnMail = function (data, callback) {
		$.post(u.inbox.returnPath,
			data,
			'json').
			done(function (res) {
				callback && callback(res);
			});
	};

	mail.outboxList = function (latest, filter, callback, errorCallback) {
		var data = {
			"lastMail": latest || 0,
			"limit": 20
		};
		if (filter != undefined && filter.length > 0) {
			data.tags = JSON.stringify(filter);
		}
		$.post(u.outbox.listPath,
			data,
			'json'
		)
			.done(function (res) {
				res.mails = res.mails.reverse();
				res.old = res.mails[ 0 ] && res.mails[ 0 ].id;
				res.latest = res.mails[ 0 ] && res.mails[res.mails.length -1 ].id;
					callback && callback(res);
			})
			.error(function (e) {
				errorCallback && errorCallback(e);
			});
	};
	mail.outboxLoadMore  = function(oldMail, filter, callback, errorCallback){
		var data = {
			"oldMail": oldMail,
			"limit": 20
		};
		if (filter != undefined && filter.length > 0) {
			data.tags = JSON.stringify(filter);
		}
		$.post(u.outbox.listPath,
			data,
			'json'
		)
			.done(function (res) {
				res.mails = res.mails.reverse();
				res.old = res.mails[ 0 ] && res.mails[ 0 ].id;
				res.latest = res.mails[ 0 ] && res.mails[res.mails.length -1 ].id;
				callback && callback(res);
			})
			.error(function (e) {
				errorCallback && errorCallback(e);
			});
	};
	mail.outboxMailDetail = function (id, callback, errorCallback) {
		$.post(u.outbox.detailPath,
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

	mail.auditReject = function (data, callback, errorCallback) {
		data.result = 0;
		$.post(u.outbox.auditPath, data, 'json')
			.done(function (res) {
				callback && callback(res);
			});
	};
	mail.auditPass = function (data, callback, errorCallback) {
		data.result = 1;
		data.reason = '';
		$.post(u.outbox.auditPath, data, 'json')
			.done(function (res) {
				callback && callback(res);
			});
	};
	mail.outboxEdit = function (data, callback, errorCallback) {
		$.post(u.outbox.editPath, data, 'json')
			.done(function (res) {
				if(res.status==1){
					callback && callback(res);
				}else{
					ALERT('错误',res.msg);
				}

			});
	};

	mail.hurry = function(id,callback){
		$.post(u.inbox.hurryPath,{mail:id}, 'json')
			.done(function (res) {
				if(res.status==1){
					callback && callback(res);
				}else{
					ALERT('错误',res.msg);
				}

			});
	};
	//绑定变量
	mail.entity.bind(u);

	module.exports = mail;
});