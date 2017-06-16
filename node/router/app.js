var http = require("http");
var url = require("url");

http.createServer(function (request, response) {
    "use strict";

    response.writeHead(200, {"Content-type": "application/json"});
    response.write("Router");

    response.end();

}).listen(9000);