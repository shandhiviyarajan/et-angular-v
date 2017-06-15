var http = require("http");

http.createServer(function (request, response) {

    response.writeHead(200, {"Content-Type": "text/HTML"});
    response.write("Hello World");
    console.log("Listening to port locahost:8000");

}).listen(8000);