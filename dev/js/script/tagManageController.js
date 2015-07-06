/**
 * Created by wungcq on 15/7/6.
 */


define(function (require, exports, module) {
//	var $ = require("jquery");
	var juicer = require("juicer");
	var tmp = require("tmpManager");
	var tabPageController = require("tabPageController");
	var user = require("user");
	var tag = require("tag");
	var md5 = require("md5");

	function tagManage() {
		this.init();
		return this;
	}

	tagManage.prototype = {
		init: function () {
			var me = this;
			if (1) {
//				me.user = user;
				me.register();
			}
			me.pageTemplate = tmp("tag-manage");
			me.addTemplate = tmp("tag-add-tr");
			me.tagTrTemplate = tmp("tag-manage-tr");

		},
		render: function () {
			var me = this;
			tag.all(function (res) {
				var html = juicer(me.pageTemplate, res);
				me.wrapper = $("#tab-page-" + me.entity().tab_id);
				me.wrapper.html(html);
				me.table = $("#tags-table");
				me.listData = res;
				me.bind();
			});
		},
		bind: function () {
			var me = this;
			me.wrapper.unbind("click").on("click",function(e){
				var tar = $(e.target);
					if(tar.attr("id")=="f-add-tag-btn"){
						me.add();
					}
					else if(tar.hasClass("f-del-tag")){
						me.del(tar);
					}
			});
		},
		addSelectNumber:function(){
			var me = this;
			me.selectOr = $("#select-dispatch-number");
			user.list(function(list){
				var html = juicer(me.userListTemplate,list);
				me.selectOr.html(html).select2();
				var select = me.selectOr.siblings(".select2-container").eq(0);
				var width = select.css("width");
				select.css({"width":"auto","min-width":width});
			});


		},


		del: function (tar) {
			var id = tar.attr("data-id"), me = this;
			tag.del({tags:[id]},function(res){
				if(res.status == 1){
					alert("删除成功");
					$("#tag-manage-tr-"+id).remove();
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
			var content = $("#f-add-tag-name").val();
			var data = {content:content};
			tag.add(data,function(res){
				var html = juicer(me.tagTrTemplate,res);
				me.table.children("tbody").eq(0).append(html);
				$("#f-add-tag-name").val("");
			});
		},

		register: function () {
			var me = this;
			if (tagManage.prototype.entities == undefined) {
				tagManage.prototype.entities = [];
			}
			tagManage.prototype.entities.push({
				tab_id: me.tab_id,
				entity: me
			});
		}
	};

	var t = new tagManage();

	tagManage.prototype.entity = function (arg) {
		if (!arg) {
			var res = tagManage.prototype.entities == undefined ? [ null ] : tagManage.prototype.entities;
			return res[ res.length - 1 ] || null;c
		}
		else if (arg.entity != undefined) {
			if (tagManage.prototype.entities == undefined) {
				tagManage.prototype.entities = [];
			}
			this.tab_id = arg.tab_id;
			tagManage.prototype.entities.push({
				tab_id: arg.tab_id,
				entity: arg.entity
			});
		} else if (arg.tab_id != undefined) {
			return tagManage.prototype.entities[ arg.tab_id ];
		}
	};

	tagManage.prototype.showPage = function () {
		var me = this;
		var openedPage = me.entity();
		if (openedPage != null && $("#people-manage").length>0) {
			tabPageController.active(me.entity().tab_id);
		} else {
			tabPageController.newTab('标签管理',
				function (tab_id) {
					me.entity({
						tab_id: tab_id,
						entity: me
					});
					me.render();
				});
		}

	};

	module.exports = t;
});