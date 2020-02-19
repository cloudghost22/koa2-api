const todolist = require('../controllers/todolist.js');
const upload = require('../controllers/upload.js');
const press = require('../controllers/press.js');
const Router = require('koa-router');
const conf = require('../config/db.js');
const koaBody = require('koa-body');

const router = new Router();

router.get('/todolist/:user_id', todolist.getTodolistByUserkid);
router.post('/todolist', todolist.createTodolist);
router.put('/todolist/:user_id/:list_id/:status', todolist.updateTodolist);
router.delete('/todolist/:user_id/:list_id', todolist.deleteTodolist);

//报纸上传
router.post('/upload',koaBody(conf.koaBody),upload.postUpload);
//文章照片上传
router.post('/photoUpload',koaBody(conf.koaBody),upload.photoUpload);

//获取上传列表
router.get('/uploadlist',upload.uploadList);
router.get('/uploadlist/:upload_id',upload.uploadList);

//删除上传
router.get('/deleteupload/:upload_id',upload.deleteUpload);

router.get('/modifyimg/:upload_id',upload.monidfyImg);

//保存报纸
router.post('/savepaper',upload.savePaper);

//删除一个区域
router.get('/deletepaper/:area_id',upload.deletePaper);

//删除所有区域
router.get('/deleteallpaper/:paper_id',upload.deleteAllPaper);

//加载所有区域
router.get('/loadallarea/:paper_id',upload.loadAllPaper);

//加载一个区域
router.get('/loadarea/:area_id',upload.loadPaper);

//加载所有报纸
router.get('/loadpress',press.getPressList);
router.get('/loadpress/:press_id',press.getPressList);

//保存编辑报纸
router.post('/savepress/',press.savePress);

//删除报纸
router.get('/deletepress/:press_id',press.deletePress);

//展示报纸
router.get('/showpress/',press.showPress);
router.get('/showpress/:press_id',press.showPress);

//展示文章
router.get('/showpaper/:paper_id',press.showPaper);

//文章计数
router.post('/showpaper/papercount',press.paperCount);

module.exports = router;