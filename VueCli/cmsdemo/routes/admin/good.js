let express =require('express');
let router = express.Router();
let  connection=require('../../config/db.js');
let bodyParser=require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());
let {cheackquery,joinarr,joinobj,isexitkey,isexitkeys}=require('../../utils/index')
router.post('/insertgood',function(req,res){
   let data=req.body;
    console.log(joinarr(Object.keys(data)));
    console.log(joinobj(data));
    if(cheackquery(data)){
       connection.query(`insert into goods (${joinarr(Object.keys(data))}) values (${joinobj(data)})`,(error,result)=>{
            if (error){
                throw error
            }
            if (result.affectedRows==1) {
                res.json({
                    code:0,
                    msg:'插入成功'
                })
            }else{
                res.json({
                    code:1,
                    msg:'插入失败'
                })
            }
       })
   } else{
        res.json({
            code:1,
            msg:'参数有误'
        })
    }

});
router.get('/querygood',function(req,res) {
    let wherestr='';
    let currentpage=req.query.currentPage;
    let obj=req.query;
    delete obj.currentPage;
    for (let i in obj ){
        if(obj[i]===''){
            delete obj[i]
        }
    }
    let arr=Object.keys(obj)
    if (arr.length){
        wherestr=' where ';
        for (i in obj){
            wherestr+=` ${i}='${obj[i]}' and`;
        }
        wherestr=wherestr.slice(0,-3)
    }
    connection.query(`select * from goodsview ${wherestr} order by gid asc`,(error,result)=>{
        if (error){
            throw error
        }

        let total=result.length;
        let data=result.slice((currentpage-1)*2,currentpage*2);
        res.json({total,data})
    })
})
router.get('/delgood',function (req,res) {
    let gid=req.query.gid
    connection.query('delete from goods where gid=?',[gid],(error,result)=>{
        if (error) {
            throw error
        }
        if (result.affectedRows==1){
            res.json({
                code:0,
                msg:'删除成功'
            })
        }else{
            res.json({
                code:1,
                msg:'删除失败'
            })
        }
    })
})
router.get('/query',function (req,res){
    let pages=req.query.page || 0;
    connection.query("select * from goods order by gid asc ",(error,result)=>{
        if (error){
            throw error;
        }
        if (result.length){
            let totalpage= result.length/5
            let data=result.slice(pages * 5,(pages+1) * 5);
            res.json({
                code:0,
                msg:'加载完成',
                data:data,
                totalpage:totalpage
            })
        } else {
            res.json({
                code:1,
                msg:'加载失败'
            })
        }
    })
})


module.exports=router;