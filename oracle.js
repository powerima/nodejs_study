var http = require('http');
var express = require('express');
var oracledb = require("oracledb");
var conn;

// 자동 커밋
oracledb.autoCommit = true;

//오라클 접속
oracledb.getConnection({
    user:"system",  
    password:"1234",
    connectString:"localhost/XE" 
},function(err,con){
    if(err){
        console.log("접속이 실패했습니다.",err);
    }
    conn = con;    
});

var app = express();
app.use(express.static('public'));
app.use(express.bodyParser()); //  추가 부분 
app.use(app.router);

app.get('/content', function(request, response){
    var idx = Number(request.param('idx'));
    var query = "select * from node where idx = :idx";
    conn.execute(query, [idx], function(error, data){
        response.send(data.rows);
    });
});

app.get('/select/', function(request, response){
    var query = "select * from node order by idx";
    conn.execute(query, function(error, data) {
        response.send(data.rows);       
    });
});

app.post('/insert/', function(request, response){
    var id = request.param('id');    
    var pwd = request.param('pwd');
    var query = "insert into node(idx, id, pwd) " + 
                "values((select nvl(max(idx), 0) +1 " +
                "from node),'" + id + "','" + pwd +"')";
    conn.execute(query, function(err, result){        
        if(err) {
            console.log("등록중 에러 발생");
            response.writeHead(500,{"ContentType":"text/html"});
            response.end("fail!!");
        }
        else {
            console.log("result", result);
            response.writeHead(200, {"ContentType" : "text/html"});
            response.end("succeess!");
        }
    });
});

app.del('/delete', function(request, response){
    var idx = Number(request.param('idx'));
    var query = "delete from node where idx = " + idx;
    conn.execute(query, function(err, result){          
        if(err) {
            console.log("삭제중 에러 발생");
            response.writeHead(500,{"ContentType":"text/html"});
            response.end("fail!!");
        }
        else {
            console.log("result", result);
            response.writeHead(200, {"ContentType" : "text/html"});
            response.end("succeess!");
        }
    });
});

http.createServer(app).listen(52273, function() {
    console.log('Server Running  at  http://127.0.0.1:52273');
});
