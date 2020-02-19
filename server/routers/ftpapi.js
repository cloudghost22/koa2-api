const  ftp = require('../controllers/ftp.js');
const Router = require('koa-router');

const router = new Router();

router.get('/getlist',ftp.getMagazineList);

module.exports = router;