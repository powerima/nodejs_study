// 모듈을 추출합니다.
var http = require("http");
var express = require("express");


var  items=[ { name:'우유',  price: '2000'},
			{ name:'홍차',  price:'3000'} ]; // 변수 items  구성


// 웹 서버를 생성합니다.
var app = express();
app.use(express.static('public'));
app.use(express.bodyParser());
app.use(app.router);

app.get('/productA', function(request, response){
	var id = Number(request.param('id'));
		
	if (isNaN(id)) {
		response.send({ error:'숫자를 입력하세요!!'});
	} else if (items[id]) {
		response.send(items[id]);
	} else {
		response.send({ error:'존재하지 않는 데이터 입니다.!!'});  
	}
	
});

app.del('/products', function(request, response){
	var id = Number(request.param('id'));	
	
	if (isNaN(id)) { 
		response.send({ error:'숫자를 입력하세요!!'});
	} else if (items[id]) {
		items.splice(id, 1);
		response.send({ message:'데이터를 삭제 했습니다.!'});

	} else {
		response.send({ error:'존재하지 않는 데이터입니다.!'});
	}
		
});

 
app.put('/products', function(request, response){
	var id = Number(request.param('id'));
	var name = request.param('name');
	var price = request.param('price');
	
	if (items[id]) {
		items[id].name = name; 
		items[id].price = price;
		response.send({ 
			message:'데이터 수정.', 
			data: items[id]
		});
	} else {
		response.send({ 
			error: '배열: ' + id +' 존재하지 않는 데이터.'
		});
	}   
	
});

app.post('/products', function(request, response){
	var name = request.param('name');
	var price = request.param('price');
	var item = { name: name,  price: price };
	items.push(item);  // 데이터를 추가합니다. 
	response.send({
		message: '데이터를 추가했습니다.' , data: item
	});	
});


app.get('/products/:id', function(request, response){
	var id = Number(request.param('id'));
	if (isNaN(id)) {
		response.send({ error:'숫자를 입력하세요!!'});
	} else if (items[id]) {
		response.send(items[id]);
	} else {
		response.send({ error:'존재하지 않는 데이터 입니다.!!'});  
	}
});

app.get('/products', function(request, response){
 	 response.send(items); 
});

// 동적라우터
app.all('/parameter/:id', function(request, response){
	var id=request.param('id');
	response.send('<h1>' + id +  '</h1>' ); 
});

//정적라우터
app.all('/parameter', function(request, response){
	var name=request.param('name');
    var region=request.param('region');
    var age = request.param('age');
	response.send('<h1>' + name + ' : ' + region + ' : ' + age + '</h1>' ); 
});

app.all('/data.xml', function(request, response){ 
	var   output = '' ;
	output += '<?xml version="1.0" encoding="UTF-8" ?>';
	output += '<products>'
	items.forEach(function (item) {
		output += '<product>'
		output += '<name>' + item.name + '</name>';
		output += '<price>' + item.price + '</price>';
		output += '</product>'
	});
	output += '</products>'
	response.type('text/xml');
	response.send( output);  
});


app.all('/data.html', function(request, response){ 
	var  output = '' ;
	items.forEach(function (item) {
		output += item.name + ' :: ' + item.price + "<br>";
	});
	response.send(output);  
});

app.all("/data.json", function(request, response) {
	response.send(items);
});



app.post("/a", function(request, response) {
	response.send("<h1>app.post Page A</h1>")
});


app.get("/a", function(request, response) {
	response.send("<h1>app.get Page A</h1>")
});


app.all("/a", function(request, response) {
	response.send("<h1>Page A</h1>")
});

app.all("/b", function(request, response) {
  	response.send("<h1>Page B</h1>")
});

app.all("/c", function(request, response) {
  	response.send("<h1>Page C</h1>")
});

// 웹 서버를 실행합니다.
http.createServer(app).listen(52273, function() {
  	console.log("Server Running at http://127.0.0.1:52273");
});
