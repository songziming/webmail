/**
 * Created by wungcq on 15/7/3.
 */

define(function (require, exports, module) {
//	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var tabPageController = require("tabPageController");
	var user = require("user");
	var md5 = require("md5");

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
		render: function () {
			var me = this;
			var template = tmp("people-manage");
			user.all(function (res) {
				var html = juicer(template, res);
				me.wrapper = $("#tab-page-" + me.entity().tab_id);
				me.wrapper.html(html);
				me.listData = res;
				me.bind();
			});
		},
		bind: function () {
			var me = this;

			me.wrapper.get(0).addEventListener('click', function (e) {
				var tar = $(e.target);
				//保存修改
				if (tar.hasClass("user-save")) {
					me.save(tar);
				}
				//删除用户
				else if (tar.hasClass("user-delete")) {
					var confirmRes = confirm("您确认要删除这个用户吗？这是不可恢复的行为！");
					confirmRes && me.delete(tar);
				}
				//取消修改
				else if (tar.hasClass("user-cancel")) {
					me.cancel(tar);
				}
				//修改密码
				else if (tar.hasClass("user-pwd")) {
					me.pwd(tar);
				}
				//触发权限修改界面
				else if (tar.hasClass("user-privilege")) {
					var id = tar.attr("data-id");
					$('#admin-user-' + id + ' .intro').attr("class", "intro change");
				}
				//点选修改权限
				else if (tar.hasClass("privilege-item")) {
					me.privilege(tar);
				}

				else if(tar.hasClass("add")) {
					me.add();
				}

			}, false);
		},
		save: function (tar) {
			var id = tar.attr("data-id"), me = this;
			var data = {};
			var pwd = $('#admin-user-' + id+' .pwd-input').val();
			if(pwd!=''){
				data.password = md5(pwd);
			}
			var privilege = $('#admin-user-' + id).attr("data-privilege");
			if(privilege!=undefined){
				data.privilege = privilege;
			}

			if(id == 0){
				var username = $('#admin-user-' + id + " .m-username").html().trim();
				data.username = username;
				user.add(data,function(res){
					me.listData.users.push(res.user);
					me.cancel(tar);
				});

			}else {
				user.update(data,function(res){
					for(var i in res){
						me.getUserInfoById(id)[i] = res[i];
					}
					me.cancel(tar);
				});
			}

		},

		delete: function (tar) {
			var id = tar.attr("data-id"), me = this;
			user.delete({users:[id]},function(res){
				if(res.status == 1){
					alert("删除成功");
					$("#admin-user-"+id).remove();
				}else {

				}
			});
		},
		privilege: function (tar) {
			var getP = function(name){
				var arr = ['consumer','dispatcher','auditor','admin'];
				var zh  = ['处理人员','分发人员','审核人员','管理员'];
				var index1 = arr.indexOf(name);
				var index2 = zh.indexOf(name);
				if(index1 > -1 ){
					return zh[index1];
				}else {
					return arr[index2];
				}
			};
			var id = tar.attr("data-id"), me = this;
			var p = tar.attr("data-privilege");
			$('#admin-user-' + id).attr("data-privilege",p);
			$('#admin-user-' + id + ' .intro .privilege').text(getP(p));
			$('#admin-user-' + id + ' .intro').attr("class", "intro");

		},
		pwd: function (tar) {
			var id = tar.attr("data-id"), me = this;
			$('#admin-user-' + id + ' .create-time').hide();
			$('#admin-user-' + id + ' .password').removeClass("hide");

		},
		cancel: function (tar) {
			var id = tar.attr("data-id"), me = this;
			if(id == 0) {
				id = me.listData.users[me.listData.users.length - 1 ].id;
				$("#admin-user-0").attr("id","admin-user-"+id);
			}
			var template = tmp('user-wrapper');
			var userData = {p: me.getUserInfoById(me.listData.users, id)};
			var html = juicer(template, userData);
			$("#admin-user-" + id).html(html);
		},
		getUserInfoById: function (arr, id) {
			for (var i in arr) {
				if (arr[ i ].id == id) {
					return arr[ i ];
				}
			}
			return false;
		},
		add: function(){
			var me = this;
			$(".m-user-wrapper.add").attr("id","admin-user-0").attr("data-id","0");
			$(".m-user-wrapper.add").removeClass("add").addClass("user");
			var html = tmp("add-user");
			$("#people-manage").append(html);
			$("#admin-user-0 .m-username").focus();

		},
		register: function () {
			var me = this;
			if (peopleManage.prototype.entities == undefined) {
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
		if (!arg) {
			var res = peopleManage.prototype.entities == undefined ? [ null ] : peopleManage.prototype.entities;
			return res[ res.length - 1 ] || null;c
		}
		else if (arg.entity != undefined) {
			if (peopleManage.prototype.entities == undefined) {
				peopleManage.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
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
		if (openedPage != null && $("#people-manage").length>0) {
			tabPageController.active(me.entity().tab_id);
		} else {
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