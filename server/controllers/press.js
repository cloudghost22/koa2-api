const query = require('../config/dbConnect.js');

const getPressList = async function (ctx) {
    let id = ctx.params.press_id;
    let str = ctx.query;
    let pagesizes = 10;
    let queryStr = '';
    let offset = (str.currentpage - 1) * 10;
    let results = "";
    if (id) {
        queryStr = `select * from press where pressID='${id}' and status != 1;`;
        tempResults1 = await query(queryStr);
        queryStr = `select * from subpress where pressID='${id}'`;
        tempResults2 = await query(queryStr);
        results = { press: tempResults1, subPress: tempResults2 };
    } else {
        queryStr = `select *,(select count(1) from press where status != 1) total  from press where status != 1 limit ${offset},${pagesizes};`;
        results = await query(queryStr);
        // console.log(queryStr);
    }
    try {

        ctx.body = results;
    } catch (e) {
        console.log(e);
        ctx.body = {
            success: false,
        }
    }
}

const savePress = async function (ctx) {
    const data = ctx.request.body;
    // console.log(data);
    let queryStr = '';
    try {
        //编辑时先删除旧数据
        if (data.pressIDOld) {
            queryStr = `update press set status = '1' where pressID='${data.pressIDOld}';`;
            await query(queryStr);
        }
        queryStr = `insert into press(pressName,pressNo,pressDate,pressID) values 
        ('${data.pressName}','${data.pressNo}','${data.pressDate}','${data.pressID}');`;
        await query(queryStr);
        for (let sub of data.subPress) {
            queryStr = `insert subpress(pressID,paperID,pressNo,paperName,pressNoValue) values 
            ('${data.pressID}','${sub.paperID}','${sub.pressNo}','${sub.paperName}','${sub.pressNoValue}');`;
            await query(queryStr);
        }
        ctx.body = {
            errno: 0
        }

    } catch (e) {
        console.log(e);
        ctx.body = {
            errno: 1,
            data: e
        }
    }
}

const deletePress = async function (ctx) {
    let id = ctx.params.press_id;
    let queryStr = `update press set status = '1' where id='${id}';`;
    try {
        await query(queryStr);
        ctx.body = {
            errno: 0,
        };
    } catch (e) {
        console.log(e);
        ctx.body = {
            success: false,
        }
    }
}

const showPress = async function (ctx) {
    let id = ctx.params.press_id;
    let str = ctx.query;
    let queryStr = "";
    if (id) {
        if(str.pressNoValue){
            queryStr = `select a.ID,a.pressName,a.pressNo as NO,a.pressDate,a.pressID,b.ID as subpressID,b.paperID,b.paperName,b.pressNo,b.pressNoValue,b.status,e.path from press a,subpress b,uploadinfo e where a.pressID = b.pressID and b.paperID = e.id and a.pressID = '${id}' and b.pressNoValue = '${str.pressNoValue}';`;
        }
        else{
            queryStr = `select a.ID,a.pressName,a.pressNo as NO,a.pressDate,a.pressID,b.ID as subpressID,b.paperID,b.paperName,b.pressNo,b.pressNoValue,b.status,e.path from press a,subpress b,uploadinfo e where a.pressID = b.pressID and b.paperID = e.id and a.pressID = '${id}' and b.pressNo = '第一版';`;
        }
        
    } else {
        //默认最新一期
        queryStr = `select a.ID,a.pressName,a.pressNo as NO,a.pressDate,a.pressID,b.ID as subpressID,b.paperID,b.paperName,b.pressNo,b.pressNoValue,b.status,e.path from press a,subpress b,uploadinfo e where a.pressID = b.pressID and b.paperID = e.id and a.ID = (select max(id) from press where status = 0) and b.pressNo = '第一版';`;
    }

    try {
        let results1 = await query(queryStr);
        //查询区域
        queryStr = `select * from paperarea c,paper d where c.areaID=d.areaID and c.status=0 and d.status = 0 and c.paperID = ${results1[0].paperID};`;
        let results2 = await query(queryStr);
        //查询第几期
        queryStr = `select ID,pressNo,pressID from press where status = 0 order by ID desc`;
        let results3 = await query(queryStr);
        ctx.body = {
            errno: 0,
            data: [results1, results2,results3],
        };
    } catch (e) {
        console.log(e);
        ctx.body = {
            success: false,
        }
    }
}


const showPaper = async function (ctx) {
    let id = ctx.params.press_id;
    let queryStr = `update press set status = '1' where id='${id}';`;
    try {
        await query(queryStr);
        ctx.body = {
            errno: 0,
        };
    } catch (e) {
        console.log(e);
        ctx.body = {
            success: false,
        }
    }
}

const paperCount = async function(ctx){
    const paperID = ctx.request.body;
    try{
        let sqlStr = `insert into papercount(paperID,click) values (${paperID.paperID},1) on DUPLICATE key UPDATE click = click+1 `;
        await query(sqlStr);
        ctx.body = {
            errno: 0,
        };
    }
    catch(e){
        console.log(e);
        ctx.body = {
            errno: 1,
            data: e
        }
    }
}


module.exports = {
    getPressList,
    savePress,
    deletePress,
    showPress,
    showPaper,
    paperCount,
}