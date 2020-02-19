
const query = require('../config/dbConnect.js');
const moment = require('moment');
const sizeOf = require('image-size');
moment.locale('zh-cn');


const photoUpload = async function (ctx) {
    let uploadPath = '';
    if (ctx.request.files.file) {
        uploadPath = ctx.request.files.file.path;
    } else {
        uploadPath = ctx.request.files.path;
    }
    uploadPath = uploadPath.substr(uploadPath.indexOf('upload')).replace(/\\/g, `/`);
    try {
        ctx.body = {
            errno: 0,
            data: [uploadPath],
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            errno: 1,
        }
    }
}

const postUpload = async function (ctx) {
    let uploadPath = '';
    let uploadName = '';
    if (ctx.request.files.file) {
        uploadPath = ctx.request.files.file.path;
        uploadName = ctx.request.files.file.name;
    } else {
        uploadPath = ctx.request.files.path;
        uploadName = ctx.request.files.name;
    }

    uploadPath = uploadPath.substr(uploadPath.indexOf('upload')).replace(/\\/g, `/`);
    let dimensions = '';
    try {
        dimensions = await sizeOf('./server/static/' + uploadPath);
        // console.log(dimensions);
    } catch (e) {
        console.log(e);
    }

    // let uploadDate = ctx.request.files.file.lastModifiedDate;
    let uploadDate = moment().format('LLL');

    try {
        let queryStr = `insert into uploadinfo(info,status,imgName,path,mtime,width,height,type) values 
        ('${JSON.stringify(ctx.request.files)}','true','${uploadName}','${uploadPath}','${uploadDate.toString()}','${dimensions.width}','${dimensions.height}','${dimensions.type}')`;
        // console.log(queryStr);
        await query(queryStr);
        // ctx.body = JSON.stringify(ctx.request.files);
        ctx.body = {
            errno: 0,
            data: [uploadPath],
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            success: false
        }
    }

}


const uploadList = async function (ctx) {
    let id = ctx.params.upload_id;
    let str = ctx.query;
    let pagesizes = 4;
    let queryStr = '';
    let offset = (str.currentpage-1)*4;
    if (id) {
        queryStr = `select * from uploadinfo where id='${id}';`;
    } else {
        queryStr = `select id,imgName,path,mtime,status,(select count(1) from uploadinfo where status != 'false') total  from uploadinfo where status != 'false' ORDER BY id desc limit ${offset},${pagesizes};`;
        // console.log(queryStr);
    }
    try {
        let results = await query(queryStr);
        ctx.body = results;
    } catch (e) {
        console.log(e);
        ctx.body = {
            success: false,
        }
    }
}

const deleteUpload = async function (ctx) {
    let upload_id = ctx.params.upload_id;

    try{
        let sqlStr = `update  uploadinfo set status = 'false' where id = ${upload_id}`;
        let result = await query(sqlStr);
        ctx.body = {
            errno: 0,
            data: result,
        }
    }
    catch(e){
        ctx.body = {
            errno: 1,
            data: e,
        }
    }

}

const img = async function (ctx) {
    let fload_name = ctx.params.fload_name;
    let img_name = ctx.params.img_name;
    ctx.body = {
        link: `../static/${fload_name}/${img_name}`,
    }

}

const monidfyImg = async function (ctx) {
    let id = ctx.params.upload_id;
    let queryStr = '';
    queryStr = `select id,imgName,path,mtime,status from uploadinfo where id='${id}';`;
    try {
        let results = await query(queryStr);
        let imgPath = results.path;
        ctx.body = {
            res
        }
    } catch (e) {
        console.log(e);
        ctx.body = {
            success: false,
            error: e
        }
    }

}

//保存区域和内容
const savePaper = async function (ctx) {
    // console.log(ctx)
    try {
        const data = ctx.request.body;
        //先删除该区域已有数据
        let queryStr = `update paper set status = 1 where areaID = '${data.areaID}';`;
        await query(queryStr);
        queryStr = `update paperarea set status = 1 where areaID = '${data.areaID}';`;
        await query(queryStr);

        //保存该区域更新数据
        //${data.content.editorContent.toString().replace(/\s/g,"")}
        queryStr = `insert into paper (areaID,content,title,subTitle,author,paperID) 
        values ('${data.areaID}','${data.content.editorContent.toString()}','${data.content.title.replace(/\s/g,"")}','${data.content.subTitle.replace(/\s/g,"")}','${data.content.author}','${data.paperID}');`;
        let results = await query(queryStr);
        let areaJson = JSON.parse(data.area);
        let startX = Math.round(areaJson.start.x);
        let startY = Math.round(areaJson.start.y);
        let endX = Math.round(areaJson.end.x);
        let endY = Math.round(areaJson.end.y);
        let areaID = areaJson.objID;
        queryStr = `insert into paperarea(paperID,detail,startX,startY,endX,endY,areaID) 
        values ('${data.paperID}','${data.area.toString()}','${startX}','${startY}','${endX}','${endY}','${areaID}');`;
        // console.log(queryStr);
        results = await query(queryStr);
        console.log(results);
        ctx.body = {
            errno: 0
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            errno: 1,
            err: err,
        }
    }
}


//删除区域和内容
const deletePaper = async function (ctx) {
    let deleteId = ctx.params.area_id;
    try {
        
        let queryStr = `update paper set status = 1 where areaID = '${deleteId}';`;
        await query(queryStr);
        queryStr = `update paperarea set status = 1 where areaID = '${deleteId}';`;
        await query(queryStr);

        ctx.body = {
            errno: 0
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            errno: 1,
            err: err,
        }
    }
}

//删除全部区域和内容
const deleteAllPaper = async function (ctx) {
    let deleteId = ctx.params.paper_id;
    try {
        
        let queryStr = `update paper set status = 1 where paperID = '${deleteId}';`;
        await query(queryStr);
        queryStr = `update paperarea set status = 1 where paperID = '${deleteId}';`;
        await query(queryStr);

        ctx.body = {
            errno: 0
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            errno: 1,
            err: err,
        }
    }
}

//加载全部区域和内容
const loadAllPaper = async function (ctx) {
    let loadId = ctx.params.paper_id;
    try {
        // let queryStr = `select * from  paper where paperID = '${loadId}' and status = 0 ;`;
        // loadInfo.paper = await query(queryStr);
        let queryStr = `select * from paperarea where paperID = '${loadId}' and status = 0 ;`;
        let paperarea = await query(queryStr);

        ctx.body = {
            errno: 0,
            data:paperarea,
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            errno: 1,
            err: err,
        }
    }
}

//加载一个区域的内容
const loadPaper = async function (ctx) {
    let loadId = ctx.params.area_id;
    try {
        let loadInfo = '';
        let queryStr = `select * from paper where areaID = '${loadId}' and status = 0;`;
        loadInfo = await query(queryStr);

        ctx.body = {
            errno: 0,
            data:loadInfo,
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            errno: 1,
            err: err,
        }
    }
}

module.exports = {
    postUpload,
    uploadList,
    deleteUpload,
    img,
    monidfyImg,
    photoUpload,
    savePaper,
    deletePaper,
    deleteAllPaper,
    loadPaper,
    loadAllPaper,
}
