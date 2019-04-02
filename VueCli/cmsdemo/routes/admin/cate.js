let express =require('express');
let router = express.Router();
let  connection=require('../../config/db.js');
let bodyParser=require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());
router.get('/table',function(req,res){
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
    console.log(wherestr);
    connection.query(`select * from category ${wherestr} order by cid asc`,(error,result)=>{
        if (error){
            throw error
        }

        let total=result.length;
        let data=result.slice((currentpage-1)*2,currentpage*2);
        res.json({total,data})
    })
});
router.get('/querycatelevel2',function(req,res){
    let cid=req.query.cid
    connection.query('select * from category where pid=?',[cid],(error,result)=>{
        if (error){
            throw error
        };
        res.json(result);
    })
});

router.get('/querycate',function(req,res){
    connection.query('select * from category where pid=0',(error,result)=>{
        if (error){
            throw error
        };
        res.json(result);
    })
});
router.post('/insertcate',function (req,res){
    let {pid,cname}=req.body;
    console.log(req.body);
    connection.query('insert into category (pid,cname) values (?,?)',[pid,cname],(error,result)=>{
        if (error){
            throw error
        } if (result.affectedRows==1){
            res.json({
                code:0,msg:'添加成功'
            })
        } else{
            res.json({
                code:1,msg:'添加失败'
            })
        }
    })
});
router.get('/delcate',function (req,res) {
    let cid=req.query.cid;
    connection.query('delete from category where cid=?',[cid],(error,result)=>{
        if (error){
            throw error
        }
        if (result.affectedRows){
            res.json({
                code:0,msg:'删除成功'
            })
        } else{
            res.json({
                code:1,msg:'删除失败'
            })
        }
    })
});
router.get('/querycurrentcate/:cid',function (req,res) {
    let cid=req.params.cid;
    connection.query("select * from category where cid=?",[cid],(error,result)=>{
        if(error){
            throw  error
        }
        if (result.length){
           res.json({
               code:0,
               data:result[0],
               msg:'数据获取成功'
           })
       } else{
           res.json({
               code:1,
               msg:'数据获取失败'
           })
       }
    })
})
router.post('/update',function (req,res){
    let {cid,cname,pid}=req.body;
    connection.query("update category set pid=?,cname=? where cid=?",[pid,cname,cid],(error,result)=>{
        if(error){
            throw error;
        }if (result.affectedRows){
            res.json({
                code:0,
                msg:'数据更新成功'
            })
        } else{
            res.json({
                code:1,
                msg:'数据更新失败'
            })
        }
    })
})

module.exports=router;