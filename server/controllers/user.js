const query = require('../config/dbConnect.js');
// const jwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const secret = require('../config/db.js');
const bcrypt = require('bcryptjs');

const getUserInfoById = async function (ctx) {
    let id = ctx.params.id;
    let result = await query(`select * from user where id ='${id}';`);
    ctx.body = result;
}

const getAllUser = async function (ctx) {
    let result = await query(`select * from user;`);
    ctx.body = result;
}

const postUserAuth = async function (ctx) {
    try {
        const data = ctx.request.body;
        let queryStr = `select * from user where username = '${data.name}'`;
        let userInfo = await query(queryStr);

        if (userInfo.length > 0) { // 如果查无此用户会返回null
            if (!bcrypt.compareSync(data.password, userInfo[0].password)) {
                ctx.body = {
                    success: false, // success标志位是方便前端判断返回是正确与否
                    info: '密码错误！'
                }
            } else { // 如果密码正确
                const userToken = {
                    name: userInfo[0].username,
                    id: userInfo[0].id
                }
                // const secret = 'vue-koa-demo'; // 指定密钥，这是之后用来判断token合法性的标志
                const token = jwt.sign(userToken, secret.jwtSecret); // 签发token
                ctx.body = {
                    success: true,
                    token: token, // 返回token
                }
            }
        } else {
            ctx.body = {
                success: false,
                info: '用户不存在！' // 如果用户不存在返回用户不存在
            }
        }
    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    getUserInfoById,
    getAllUser,
    postUserAuth
}