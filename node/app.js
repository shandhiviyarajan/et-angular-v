/*
 Application Modules
 */
var http = require("http");
var fs = require("fs");
var url = require("url");

/*
 Custom Modules
 */
var module1 = require("./module1");

http.createServer(function (request, response) {

    response.writeHead(200, {"Content-Type": "text/HTML"});
    response.write("Hello World");

    response.write(module1.test());

    console.log("Listening to port localhost:8000");

    response.end();

}).listen(8000);


function readHTML(path, response) {
    response.write(data);

}