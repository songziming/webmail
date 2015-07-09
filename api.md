现有api接口
====
-------------------

[TOC]

## 用户基本操作

###登陆

- 方法:`POST`
- 路由: `/user/login`
- 发送参数:
	- username: `String` 用户名
	- password: `String` 用户密码
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回信息

###登出

- 方法:`GET`
- 路由: `/user/logout`
- 发送参数: **无**
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息

###得到用户信息
得到自己的信息
- 方法:`GET`
- 路由: `/user/info`
- 发送参数:
	- username: `String` 用户名
	- password: `String` 用户密码
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- user: `Object` 
		- username: `String` 用户的用户名
		- id: `Number` 用户的id
		- privilege: `String` 枚举类型，是dispatcher,consumer,auditor,admin中的一个 *注意：不一定是最新的，登陆刷新*

##管理用户

###得到所有用户
得到所有用户的所有信息
- 方法:`GET`
- 路由: `/user/all`
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- users: `Array` 每一项都是一个用户instance，参见`/user/info`

###改变用户身份
批量改变用户的身份 **已弃**

###更新用户信息

- 方法:`POST`
- 路由: `/user/update`
- 发送参数:
	- userId: `String` 要更新的用户的id
	- password: `String` `Opt` 用户密码
	- privilege: `String` `Opt` 枚举类型
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- user: `Object` 用户instance

###增加一个用户

###删除用户

##收件箱

###查看邮件列表

仅看到符合自己身份的邮件，即所有用户同意调用该接口

- 方法: `POST`
- 路由: `/inbox/list`
- 发送字段
	- oldMail: `Number` `Opt` 返回id小于这封邮件的邮件
	- limit: `Number` `Opt`最多返回多少元素，*用于分页，默认为20*
	- tags: `Array` `Opt` 符合条件的标签限制，*默认不限制*
	- lastMail: `Number` `Opt` 会返回新于这封邮件Id的邮件
- 返回结果
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mails: `Array`返回该邮件实例数组
	- count: `Number` 符合条件的邮件共有多少个

###查看邮件细节

仅看到符合自己身份的邮件细节

- 方法: `POST`
- 路由: `/inbox/detail`
- 发送字段
	- mail: `Number` 查看的邮件的id
- 返回结果
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object`返回该邮件实例



###分发邮件

需要该用户为管理员或分发人员

- 方法: `POST`
- 路由: `/inbox/detail`
- 发送字段
	- mail: `Number` 查看的邮件的id
	- consumers: `Array` 要分发给的处理人员数组，每一项为id
- 返回结果
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object`返回该邮件实例
####例

``` javascript
{
	mail :１，
	consumers : [1,2,3]
}
```



###回复邮件

需要该用户为管理员或处理人员

- 方法:`POST`
- 路由: `/inbox/handle`
- 发送参数:
	- title: `String` 回复的邮件的标题
	- urgent: `Number` 1/0
	- auditorId: `Number` `Opt` 选择审核人员
	- html: `String` 发送的html
	- text: `String` 发送的邮件正文
	- to: `String` 发送的邮件地址，格式应为`name<add@domain.com>,...`
	- replyToId: `Number` 是为了处理那一封邮件，inbox的邮件Id
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object` 一个outbox的mail的实例

###退信

需要该用户为管理员或处理人员
		
- 方法:`POST`
- 路由: `/inbox/return`
- 发送参数:
	- mail: `Number` 表示邮件的id
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object`返回该邮件实例

###直接完成邮件

需要该用户为管理员或处理人员

- 方法:`POST`
- 路由: `/inbox/return`
- 发送参数:
	- mail: `Number` 表示邮件的id
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object`返回该邮件实例

###设置(更新)邮件

需要该用户为管理员或分发人员

- 方法:`POST`
- 路由: `/inbox/update`
- 发送参数:
	- mail: `Number` 表示邮件的id
	- deadline: `Date` 截至时间
	- tags: `Array` 每一项为tag的id
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object`返回该邮件实例

###转发邮件

需要用户是处理人员
- 方法:`POST`
- 路由: `/inbox/trans`
- 发送参数:
	- mail: `Number` 表示邮件的id
	- assignee: `Number` 表示要被转发给谁
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object`返回该邮件实例

##发件箱

###查看邮件列表

仅看到符合自己身份的邮件，即所有用户同意调用该接口

- 方法: `POST`
- 路由: `/outbox/list`
- 发送字段
	- oldMail: `Number` `Opt` 返回id小于这封邮件的邮件
	- limit: `Number` `Opt` 最多返回多少元素，*用于分页，默认为20*
	- lastMail: `Number` `Opt` 返回id大于这封邮件的邮件 
- 返回结果
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mails: `Array`返回该邮件实例数组
	- count: `Number` 符合条件的邮件共有多少个

###查看邮件细节

仅看到符合自己身份的邮件细节

- 方法: `POST`
- 路由: `/outbox/detail`
- 发送字段
	- mail: `Number` 查看的邮件的id
- 返回结果
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object`返回该邮件实例
	
###审核邮件

- 方法: `POST`
- 路由: `/outbox/audit`
- 发送字段
	- mail: `Number` 审核的邮件的id
	- result: `Number` 1/0，表示通过或者拒绝
	- reason: `String` 通过或拒绝的原因
- 返回结果
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object` 返回该邮件实例 

###修改被拒绝的邮件

当邮件被审核拒绝时，处理人员可以重新处理并提交，但是必须是同一个处理人员

- 方法:`POST`
- 路由: `/outbox/handle`
- 发送参数:
	- mail: `Number` 修改的被拒绝的邮件的id **重要**
	- title: `String` 回复的邮件的标题
	- auditorId: `Number` `Opt` 选择审核人员
	- html: `String` 发送的html
	- text: `String` 发送的邮件正文
	- to: `String` 发送的邮件地址，格式应为`name<add@domain.com>,...`
- 返回结果:
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- mail: `Object` 一个outbox的mail的实例

##标签

###获取标签

- 方法: `GET`
- 路由: `/tag/all`
- 返回字段
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- tags: `Array`返回标签实例数组，其中每一项为`Object`
		- content: `String` 标签的内容
		- id : `Number` 标签的id

###添加标签

- 方法: `POST`
- 路由: `/tag/add`
- 发送字段
	- content: `String` 要添加的标签的内容
- 返回字段
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- tag: `Object`返回标签实例
		- content: `String` 标签的内容
		- id : `Number` 标签的id

###删除标签

- 方法: `POST`
- 路由: `/tag/del`
- 发送字段
	- tags: `Array` 要删除的标签id数组，例如:[1,2,3]
- 返回字段
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息

##消息模块

###查看接收到的所有信息

- 方法: `POST`
- 路由: `/message/receive`
- 发送字段
	- oldMessage: `Number` `Opt` 返回id小于oldMessage的信息
	- limit: `Number` `Opt` 最多返回多少元素，*用于分页，默认为20*
	- lastMessage: `Number` `Opt` 返回id大于此id的message
- 返回字段（默认仅返回unread的信息）
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- messages: `Array` 每一个接收到的信息的实体
		- id: `Number` 这条信息的id
		- title: `String` 题目
		- text: `String` 内容文本
		- html: `String` html富文本
		- sender: `Object` 发送人的用户实例

###查看发送出去的所有信息

- 方法: `POST`
- 路由: `/message/sent`
- 发送字段
	- oldMessage: `Number` `Opt` 返回id小于oldMessage的信息
	- limit: `Number` `Opt` 最多返回多少元素，*用于分页，默认为20*
	- lastMessage: `Number` `Opt` 返回id大于此id的message
- 返回字段
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- messages: `Array` 每一个发送出去的信息的实体
		- id: `Number` 这条信息的id
		- title: `String` 题目
		- text: `String` 内容文本
		- html: `String` html富文本
		- receivers: `Array` 数组，每一项为接收的人的用户实例

###查看信息详情

- 方法: `POST`
- 路由: `/message/detail`
- 发送字段
	- message: `Number` 查看的message的id
- 返回字段
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- message: `Object` 该信息的实体
		- id: `Number` 这条信息的id
		- title: `String` 题目
		- text: `String` 内容文本
		- html: `String` html富文本
		- sender: `Object` 发送人的用户实例
		- receivers: `Array` 数组，每一项为接收的人的用户实例

###发送信息

- 方法: `POST`
- 路由: `/message/send`
- 发送字段
	- title: `String` 标题
	- text: `String` 正文文本
	- html: `String` 富文本
	- receivers: `Array` 接收邮件的用户的id的数组
- 返回字段
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息
	- message: `Object` 该信息的实体
		- id: `Number` 这条信息的id
		- title: `String` 题目
		- text: `String` 内容文本
		- html: `String` html富文本
		- sender: `Object` 发送人的用户实例
		- receivers: `Array` 数组，每一项为接收的人的用户实例

###置信息为已读

- 方法: `POST`
- 路由: `/message/read`
- 发送字段
	- messages: `Array` 发送要变为已读的信息id
- 返回字段
	- status: `Number` 1/0 *1表示成功，0表示失败*
	- msg: `String` 返回具体信息信息



