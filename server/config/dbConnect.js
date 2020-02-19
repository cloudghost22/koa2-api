const mysql = require('mysql');
const link = require('./db.js');

const pool = mysql.createPool(link.mysql);

let query = function (sql, values) {
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (error, results, fields) => {

                    if (error) {
                        reject(error)
                    } else {
                        resolve(results)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}


module.exports = query