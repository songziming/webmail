WebMail
=======

这是我们软件工程过程的暑期项目，实现了一个在线企业邮件管理系统。

该项目面向中小企业，企业注册了企业邮箱之后，可以使用本系统进行管理。员工有分发人员、处理人员、审核人员和管理员四种角色，对企业收到的邮件进行流程化处理。

### 总体架构

- 服务器：nginx
- service服务器：node.js
- 数据库：待定（几大可能是 mysql+ sqlite）
- 前端：bigpipe
- 总体倾向于 SPA


### 工作流

``` bash
npm install
npm install gulp -g
npm install gulp --save-dev
npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-clean gulp-notify gulp-rename gulp-livereload gulp-cache --save-dev
gulp dev
```

### Nginx 配置

这只是一个示例，更详细的说明请参见项目文档。

``` nginx
server {
    listen          12306;
    server_name     localhost;
    root            /path/to/webmail/static/;

    location ~* \.(gif|jpg|jpeg|css|js|bmp|png|woff|ttf|etf)$ {
        root        /path/to/webmail/static/;
        access_log  off;
        expires     30d;
    }

    location / {
        proxy_pass   http://127.0.0.1:8088;
    }
}
```
