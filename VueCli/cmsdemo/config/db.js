let mysql=require('mysql');
let connection=mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'daily',
    port:3306,
    multipleStatements:true
});
connection.connect();
module.exports=connection;