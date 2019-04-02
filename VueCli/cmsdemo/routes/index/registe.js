let express =require('express');
let router = express.Router();
let  connection=require('../../config/db.js');
let {cheackquery,joinarr,joinobj,isexitkey,isexitkeys}=require('../../utils/index');
router.get('/reg',function(req,res) {
    let {phone,password}=req.query;
    let nickname='you'+Date.now();
    connection.query('insert into users (phone,password,nickname) values (?,?,?)',[phone,password,nickname],(error,result)=>{
        if (error){
            throw error
        }
        if(result.affectedRows==1){
            res.json({
                code:0,
                msg:"注册成功"
            })
        } else{
            res.json({
                code:0,
                msg:"注册失败"
            })
        }
    })
});
router.post('/',function (req,res){
    let {phone,password}=req.body;
    connection.query("select * from users where phone=? and password=?",[phone,password],(error,result)=>{
        if (result.length){
            res.json({
                uid:result[0].id,
                code:0,
                msg:"登录成功"
            })
        }
        else {
            res.json({
                code:1,
                msg:"登录失败"
            })
        }
    })
})

router.post('/wxlogin',function (req,res){
        let code=req.body.code;
        let nickname=req.body.nickName;
        let appid='wxcab017506b8f8df0';
        let thumb = req.body.avatarUrl;
        let secret='59753c2730cb40cecffa311136f314fb';
        let url=`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
        request(url,function (error,response,body) {
            let data=JSON.parse(body);
            console.log(data);
            console.log(`insert into users (nickname,phone,password,thumb,openid) values('${nickname}','123345','12333','${thumb}','${data.openid}')`)
            connection.query(`insert into uerlogin (nickname,phone,password,thumb,openid) values('${nickname}','123345','12333','${thumb}','${data.openid}')`,(error,result)=>{
                if(error)throw error;
                if (result.affectedRows){
                    res.json({
                        code:0,
                        openid:data.openid
                    })
                }else{
                    res.json({
                        code:1,
                    })
                }
            })

        })
})



module.exports=router;