let express =require('express');
let router = express.Router();
let  connection=require('../../config/db.js');
router.get('/cate/:cid/:currentpage',function(req,res){
    let {cid,currentpage}=req.params;
   console.log(cid);
   connection.query('select * from goodsview where cid1= ? ',[cid,currentpage],(error,result)=>{
       if (error){
           throw error
       }
       if (!result.length){
           res.json({
               code:1,
               msg:'暂无信息'
           })
       }else{
           let total=Math.ceil(result.length / 5);
           let start=(currentpage-1)*5;
           let end=currentpage*5;
           let data=result.slice(start,end);
           res.json({
               code:0,
               msg:'数据获取成功',
               total,
               data
           })
       }
   })
});
router.get('/goodsinfo',function(req,res){
    let {gid,cid1}=req.query;
    console.log(gid,cid1);
    connection.query("select * from goodsview where cid1=? and gid!=? order by gid asc limit 0,5;select * from goodsview where gid=?",[cid1,gid,gid],(error,result)=>{
        if(error){throw error}
        let recommendgoods=[];
        let goodsinfo={};
        if (result[0].length>0){
            recommendgoods=result[0];
        }
        if (result[1].length>0){
            goodsinfo=result[1][0];
        }
        if (result[0].length && result[1].length){
            res.json({
                code:0,
                msg:'数据获取成功',
                goodsinfo,
                recommendgoods
            })
        } else{
            res.json({
                code:1,
                msg:'数据获取失败',
                goodsinfo,
                recommendgoods
            })
        }

    })
});
router.get('/goodslist',function (req,res) {
    let cid=req.query.cid;
    connection.query('select * from category where pid=?; select * from goods where cid1=?',[cid,cid],(error,result)=>{
        if (error){
            throw error
        }
        let category=[];
        if(result[0].length){
            category=result[0];
        }
        category.forEach(ele=>{
            let goods=result[1].filter(goods=>goods.cid2==ele.cid);
            ele.goods=goods;
        });
        res.json(category)
    })
})
module.exports = router;
