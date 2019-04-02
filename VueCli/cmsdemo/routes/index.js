var express = require('express');
var router = express.Router();
var goods=require('./index/goods');
var registe=require('./index/registe');
var car=require('./index/car');
var order =require('./index/order');
router.use('/goods',goods);
router.use('/registe',registe);
router.use('/car',car);
router.use('/order',order)
module.exports = router;
