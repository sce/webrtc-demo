var browserify = require('browserify-middleware');

var express = require('express');
var app = express();

// ----------------------------------------------------------------------------

app.set('view engine', 'pug');
app.set('views', './views');

// ----------------------------------------------------------------------------

app.get('/javascript/actAsClient.js', browserify('./public/javascript/actAsClient.js'));
app.get('/javascript/actAsServer.js', browserify('./public/javascript/actAsServer.js'));

app.use(express.static('public'));

app.get('/', function(req, res, next) {
  res.send("Hello world!");
});

app.get('/client', function(req, res) {
  res.render('client');
});

app.get('/server', function(req, res) {
  res.render('server');
});

// ----------------------------------------------------------------------------

var port = 3000;
app.listen(port, function() {
  console.log("Listening on port", port);
});
