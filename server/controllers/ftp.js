const fs = require('fs')
const path = require('path')

const getMagazineList = async function (ctx) {
    let fileList = [];
    try {
        //读取上传目录下的所有文件夹
        const files = fs.readdirSync(path.normalize('server/static/upload/ftp'))
        files
            .forEach(file => {
                // console.log(fs.statSync(path.normalize(`server/static/upload/ftp/${file}`)));
                fileList.push({
                    name: file,
                    paht: path.normalize(`server/static/upload/ftp/${file}/`),
                    birthtime: fs.statSync(path.normalize(`server/static/upload/ftp/${file}`)).birthtimeMs,
                    src:path.normalize(`upload/ftp/${file}/files/mobile/1.jpg`),
                    href:path.normalize(`upload/ftp/${file}/index.html`),
                    info:`京烟报第${file}期`
                });
            });
        //按降序排    
        fileList.sort(function(a,b){return b.birthtime - a.birthtime});

        ctx.body = {
            errno: 0,
            data: fileList,
        }
    } catch (e) {
        console.log(e);
        ctx.body = {
            errno: 1,
        }
    }

    // try {
    //     ctx.body = {
    //         errno: 0,
    //         data: [uploadPath],
    //     }
    // } catch (err) {
    //     console.log(err);
    //     ctx.body = {
    //         errno: 1,
    //     }
    // }

}


module.exports = {
    getMagazineList,
}