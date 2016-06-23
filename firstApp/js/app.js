/*

Steps : 
1. Create a server to listen to a port specified
2. initialize the http module
3. listen for request from client and validate
4. if all validations are clear, send a response displaying success message on client

*/

// Step 1

// creating a server

var http = require('http');

// create a server

/*



var server = http.createServer();
server.on('request', function(request, response){
	
});

*/

// shorthand of above format
var server = http.createServer(function(request, response){

	/*console.log("I am ON");
	response.write('Hello World');*/

	console.log("Request Recieved");
	console.log("Request Method is : "+request.method);
	console.log("URL is : "+request.url);

	if(request.method === 'POST' && request.url === '/register'){
		var message = '';

		// this data event always respond to POST request

		request.on('data', function(dataFromClient){
			message += dataFromClient.toString();
			console.log("Data recieved at server is : "+message);
		});

		response.end('END');


	}

}).listen(9090);