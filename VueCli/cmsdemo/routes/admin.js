var express = require('express');
var router = express.Router();
var login=require('./admin/login');
var webinfo =require('./admin/webinfo');
var cate=require('./admin/cate');
var good=require('./admin/good') ;
/* GET users listing. */
router.use('/good',good);
router.use('/login',login);
router.use('/cate',cate);
router.use('/webinfo',webinfo);
module.exports = router;
