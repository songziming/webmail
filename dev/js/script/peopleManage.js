/**
 * Created by wungcq on 15/7/3.
 */

define(function (require, exports, module) {
	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var tabPageController = require("tabPageController");

	function peopleManage(user) {
		this.init(user);
		return this;
	}

	peopleManage.prototype = {
		init: function (user) {
			var me = this;
			if (user) {
				me.user = user;
				me.register();
			}

		},
		render: function(){
			alert("render!");
		},
		register: function () {
			var me = this;
			if(peopleManage.prototype.entities==undefined){
				peopleManage.prototype.entities = [];
			}
			peopleManage.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		}
	};

	var p = new peopleManage();

	peopleManage.prototype.entity = function (arg) {
		if(!arg){
			var res = peopleManage.prototype.entities==undefined?[null]:peopleManage.prototype.entities;
			return res[0]||null;
		}
		else if (arg.entity != undefined) {
			if(peopleManage.prototype.entities==undefined){
				peopleManage.prototype.entities = [];
			}
			peopleManage.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return peopleManage.prototype.entities[ arg.tab_id ];
		}
	};

	peopleManage.prototype.showPage = function () {
		var me = this;
		var openedPage = me.entity();
		if(openedPage!=null){

		}else {
			tabPageController.newTab('人员管理',
				function (tab_id) {
					me.entity({
						tab_id: tab_id,
						entity: me
					});
					me.render();
				});
		}

	};


	module.exports = p;
});