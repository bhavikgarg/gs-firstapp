// import express

var express = require('express');
var app = express();

var path = require('path');



// listen to port
var p = 9090;
var server = app.listen(p , function(){
	var host = server.address().address;
  	var port = server.address().port;

  	console.log("listening at http://%s:%s", host, port)
});



// respond with the html page for request for home page

app.get('/', function(req, res){
	res.sendFile(path.join("index.html"));
});

// if request is for register
app.post('/register', function(req, res){

	res.send("POST Request Recieved");
	
});