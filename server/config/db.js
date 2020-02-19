const getUploadFileExt = require('../utils/getUploadFileExt');
const getUploadFileName = require('../utils/getUploadFileName');
const checkDirExist = require('../utils/checkDirExist');
const getUploadDirName = require('../utils/getUploadDirName');
const path = require('path');


module.exports = {
    port: 3000,
    mysql: {
        "host": "10.15.32.58",
        "user": "root",
        "password": "qazwsx",
        "database": "todolist"
    },
    pageNumber: 10,
    mainTable: 'share',
    session: {
        secret: "baiduyunsearch",
        key: "baiduyunsearch",
        maxAge: 600000
    },
    jwtSecret: 'vue-koa-project',
    koaBody: {
        multipart: true,
        encoding: 'gzip',
        formidable: {
            uploadDir: '../static/upload',
            keepExtensions: true,
            maxFieldsSize: 10 * 1024 * 1024,
            onFileBegin: (name, file) => {
                // console.log(file);
                // 获取文件后缀
                const ext = getUploadFileExt(file.name);
                // 最终要保存到的文件夹目录
                const dirName = getUploadDirName();
                const dir = path.join(__dirname, `../static/upload/${dirName}`);
                // 检查文件夹是否存在如果不存在则新建文件夹
                checkDirExist(dir);
                // 获取文件名称
                const fileName = getUploadFileName(ext);
                // 重新覆盖 file.path 属性
                file.path = `${dir}/${fileName}`;
                // app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
                // app.context.uploadpath[name] = `${dirName}/${fileName}`;
            },
        }
    }
};