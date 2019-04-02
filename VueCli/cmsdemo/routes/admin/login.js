let express =require('express');
let router = express.Router();
let bodyParser=require('body-parser');
let  connection=require('../../config/db.js');
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());
router.get('/',function (req,res) {
    res.json({name:'zhangsan'})
});
router.post('/',(req,res)=>{
    let{username,password}=req.body;
    console.log(req.body);
    connection.query("select * from manage where username=? and password=?",[username,password],(error,result,field)=>{
        if (error){
            throw error
        }
        if(result.length){
            res.json({code:0,msg:'success'});
        }
        else{
            res.json({code:1,msg:'fail'});
        }
    })
});


module.exports=router;