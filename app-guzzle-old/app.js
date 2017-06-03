var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'app')));
console.log(path.join(__dirname, 'app'));
app.get('/', function (req, res) {
  res.send('Hello World!')
})

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.listen(port, function () {
  console.log('Example app listening on port '+port);
})

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}