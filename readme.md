# 安装依赖
## 安装淘宝镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org
## 安装程序依赖
cnpm install
# 设置数据库信息
server\config\db.js
# vue生成前端静态文件
## 找到vue-project
vue run build
## 添加至该项目目录下
koa2-api\server\static
# 运行
node app.js