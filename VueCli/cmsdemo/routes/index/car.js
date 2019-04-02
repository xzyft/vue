var express = require('express');
var router = express.Router();
var connection=require('../../config/db');

router.post('/',function (req,res) {
    let gid=req.body.gid;
    connection.query("select * from goodsview where gid not in(?) limit 0,4",[gid],(error,result)=>{
        if(error){throw error}
        let recommendgoods=[];
        recommendgoods=result;
        res.json({recommendgoods})
    })


});
module.exports=router;