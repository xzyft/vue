let express =require('express');
let router = express.Router();
let  connection=require('../../config/db.js');
router.post('/insert',function (req,res){
    let {total,price,discount,uid,goods }=req.body;
    connection.query("insert into orders (total,price,discount,uid) values (?,?,?,?)",[total,price,discount,uid],(error,result)=>{
       if (error){
           throw error
       }
       if (result.affectedRows==1){
          let oid=result.insertId;
          let goodlist=goods.map(ele=> {
              return "(" + [ele.gid, ele.numbers, oid].join()+ ")"
          });
            let str=goodlist.join();
            connection.query(`insert into ordersextra (gid,numbers,oid) values ${str}`,(error,result)=>{
                if(error){
                    throw error
                }
                if(result.affectedRows>=1){
                    res.json({
                        code:0,
                        msg:'success',
                        oid,
                    })
                } else{
                    res.json({
                        code:1,
                        msg:'fail',
                    })
                }
            })
       }else{
           res.json({
               code:1,
               msg:'fail',
           })
       }
    });
})
router.get('/query',function(req,res){
   let {uid,oid}=req.query;
    // console.log(oid);
    connection.query("select * from orders where uid=? and oid=?;select * from ordersextra,goods where ordersextra.gid=goods.gid and oid=?",[uid,oid,oid],(error,result)=>{
       if (error){
           throw error
       };
       if(result[0].length && result[1].length){
           res.json({
               code:0,
               msg:'success',
               order:result[0][0],
               goods:result[1]
           })
       }
       else {
          res.json({
              code:1,
              msg:'fail'
          })
       }
   })
});
router.get('/allorders',function (req,res) {
    let uid=req.query.uid;
    connection.query("select * from orders where uid=?;select orders.oid,goods.* from orders,ordersextra,goods where orders.oid=ordersextra.oid and ordersextra.gid=goods.gid and orders.uid=?",[uid,uid],(error,result)=>{
        if (error){throw error}
        if (result[0].length){
            let orders=result[0];
            orders.forEach(ele=>{
                ele.goods=result[1].filter(goods=>goods.oid==ele.oid)
            });
            res.json({
                code:'',
                msg:'success',
                orders:orders
            })
        }else {
            res.json({
                code:0,
                msg:'success',
                orders:[]
            })
        }
    })
});
router.get('/orderdetail')
module.exports = router;