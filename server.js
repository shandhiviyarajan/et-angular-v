var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'app')));
var port = 3000;
app.set('port', port);


app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
