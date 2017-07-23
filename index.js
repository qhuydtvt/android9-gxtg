var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Hottie = require('./models/hottie');
var app = express();

mongoose.connect('mongodb://admin:admin@ds117913.mlab.com:17913/android9-gxtg',
{ useMongoClient: true });

// var hottie = new Hottie({
//     name: "Lệ rơi",
//     age: 24,
//     image: "http://cms.kienthuc.net.vn/uploaded/ngoclinh/2015_06_01/newfolder3/tai-san-sau-mot-nam-doi-doi-than-toc-cua-le-roi-hinh-11.jpg"
//   });
//
// hottie.save();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});


app.get('/api', function(req, res) {
  res.json({ 'hello': 'world' });
});

app.get('/api/gxtg', function(req, res) {
  Hottie.find(function(err, hotties) {
    if (err) {
      res.json({ success: 0, message: 'Could not get data from mlab' });
    } else {
      res.json(hotties);
    }
  });
});

app.post('/api/gxtg', function(req, res) {
  // CREATE
  var body = req.body;

  var name = body.name;
  var age = body.age;
  var image = body.image;

  var hottie = new Hottie({
      name: name,
      age: age,
      image: image
  });

  hottie.save(function(err, addedHottie){
    if (err) {
      res.json({ success: 0, message: 'Could not add record ' + err });
    } else {
      res.json(addedHottie);
    }
  });
});

app.listen(app.get('port'), function() {

  console.log('Node app is running on port', app.get('port'));
});
