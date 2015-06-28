#webmail
总体架构：
 服务器：nginx
 service服务器：node.js
 数据库：待定（几大可能是 mysql+ sqlite）
 前端：bigpipe
 总体倾向于 SPA


工作流：
#work-flow

1. $ npm install

2. $ npm install gulp -g

3. $ npm install gulp --save-dev

4. $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-clean gulp-notify gulp-rename gulp-livereload gulp-cache --save-dev

5. $ gulp dev



nginx 配置：

```shell
    server {
        listen              10001;
        server_name         localhost;
        root                /Users/wungcq/workspace/webMail/static/;


        location ~* \.(gif|jpg|jpeg|css|js|bmp|png|woff|ttf|etf)$ {
             root                /Users/wungcq/workspace/webMail/static/;
                access_log   off;
                expires      30d;

        }

        location / {
            proxy_pass   http://127.0.0.1:8088;
        }


    }
```