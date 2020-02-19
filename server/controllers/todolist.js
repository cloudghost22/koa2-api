const query = require('../config/dbConnect.js');

const getTodolistByUserkid = async function (ctx) {  // 获取某个用户的全部todolist
    try {
        let id = ctx.params.user_id;
        let results = await query(`select * from list where user_id = '${id}';`);
        ctx.body = results;
    } catch (err) {
        console.log(err);
    }
}

const createTodolist = async function (ctx) { // 给某个用户创建一条todolist
    try {
        const data = ctx.request.body;
        let queryStr = `insert into list (user_id,content,status) values 
        ('${data.user_id}','${data.content}','${data.status}');`
        console.log(queryStr);
        let results = await query(queryStr);
        console.log(results);
        ctx.body = {
            success: true
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            success: false
        }
    }

}

const updateTodolist = async function (ctx) {
    try {
        let user_id = ctx.params.user_id;
        let list_id = ctx.params.list_id;
        let status = ctx.params.status == 0 ? 'true' : 'false';//状态翻转

        let queryStr = `update list set status = '${status}' where user_id = '${user_id}' and id = '${list_id}';`
        await query(queryStr);
        ctx.body = {
            success: true
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            success: false
        }
    }
}

const deleteTodolist = async function (ctx) {
    try {
        let user_id = ctx.params.user_id;
        let list_id = ctx.params.list_id;
        let queryStr = `delete from list where user_id = '${user_id}' and id = '${list_id}'; `;
        let results = await query(queryStr);
        ctx.body = {
            success: true
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            success: false
        }
    }
}

module.exports = {
    getTodolistByUserkid,
    createTodolist,
    updateTodolist,
    deleteTodolist
}