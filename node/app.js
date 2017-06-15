var http = require("http");
var module1 = require("./module1");

http.createServer(function (request, response) {

    response.writeHead(200, {"Content-Type": "text/HTML"});
    response.write("Hello World");

    response.write(module1.test());

    console.log("Listening to port localhost:8000");

}).listen(8000);