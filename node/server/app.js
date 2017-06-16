'use strict';

var http = require("http");
var url = require("url");
var fs = require("fs");
var module1 = require("./module1");

http.createServer(function (request, response) {

    response.writeHead(200,null,{"Content-Type": "text/HTML"});
    response.write("Hello World");
    response.write(module1.test());
    response.write(module1.my_var);
    // console.log("Listening to port localhost:8000");
    fs.readFile("./home.html", null, function (error, data) {
       if(error){
           response.writeHead(404,"File not found!",{"Content-Type": "text/HTML"});
       }else{
           response.write(data);
       }
        response.end();
    });



}).listen(8000);