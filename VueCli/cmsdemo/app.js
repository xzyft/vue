var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var app = express();
var fs=require('fs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/', indexRouter);
app.use('/admin', adminRouter);

//上传
app.post('/uploadimg',upload.single('file'),(req,res)=>{
  let file=req.file;
  let date=new Date();
  let dirname=[date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
  let pathname=__dirname+'/uploads/'+dirname;
  if(!fs.existsSync(pathname)){
    fs.mkdirSync(pathname)
  }
  let extname=file.mimetype.split('/')[1];
  let imgname=date.getTime()+Math.floor(Math.random()*100)+'.'+extname;
  fs.readFile(file.path,(error,data)=>{
    fs.writeFile(pathname+'/'+imgname,data,(error,data)=>{
      if (error){throw  error};
      fs.unlinkSync(file.path);
      res.send('/'+dirname+'/'+imgname)
    })
  })
})
app.get('/removeimg',(req,res)=>{
  let url=req.query.url;
  let pathname=__dirname+'/uploads'+url;
  fs.unlink(pathname,(err)=>{
    if (err){
      throw err
    }
    res.json({
        code:0,
        msg:'删除成功'
    })
  })

})
app.post('/uploadimgcontent',upload.single('file'),(req,res)=>{
    let file=req.file;
    let date=new Date();
    let dirname=[date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
    let pathname=__dirname+'/uploads/'+dirname;
    if(!fs.existsSync(pathname)){
        fs.mkdirSync(pathname)
    }
    let extname=file.mimetype.split('/')[1];
    let imgname=date.getTime()+Math.floor(Math.random()*100)+'.'+extname;
    fs.readFile(file.path,(error,data)=>{
        fs.writeFile(pathname+'/'+imgname,data,(error,data)=>{
            if (error){throw  error};
            fs.unlinkSync(file.path);
            res.json({errno:0,data:['/'+dirname+'/'+imgname]})
        })
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
