const  auth = require('../controllers/user.js');
const Router = require('koa-router');
const query = require('../config/dbConnect.js')

const router = new Router();

router.get('/user/:id',auth.getUserInfoById);

router.get('/allUser',auth.getAllUser);

router.post('/user',auth.postUserAuth);

module.exports = router;