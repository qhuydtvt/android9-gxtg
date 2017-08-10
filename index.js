var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var _ = require('lodash');

var Hottie = require('./models/hottie');
var User = require('./models/user');

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

app.get('/api/testhash', function(req, res) {
  var hash = bcrypt.hashSync('hieuhuhong', 10);
  res.json({hash: hash});
});

app.post('/api/testhash', function(req, res) {
  var password = req.body.password;
  var hash = bcrypt.hashSync('hieuhuhong', 10);

  var result = bcrypt.compareSync(password, hash);

  if (result) {
    res.json({message : "Ahihi"});
  } else {
    res.json({message : "Đi chỗ khác chơi"});
  }
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

app.post('/api/login', (req, res) => {
  var body = req.body;
  var username = body.username; // hieu
  var password = body.password;

  User.findOne({username: username}, (err, user) => {
    if (err) {
      res.json({success: 0, message: "Database error, could not find user", err: err});
    } else {
      if (!user) {
        res.json({success: 0, message: "User not found" });
      } else {
        var hash = user.password;
        if (bcrypt.compareSync(password, hash)) {
          res.json({success: 1, message: "Login OK" });
        } else {
          res.json({success: 0, message: "Invalid password"});
        }
      }
    }
  });
});

app.post('/api/register', function(req, res) {
  var body = req.body;
  var username = body.username;
  var password = body.password;

  var saveUser = function(username, password) {
  var user = new User({
    username: username,
    password: bcrypt.hashSync(password, 10) // TODO
  });

  user.save(function(err, saveUser) {
    if (err) {
      res.json({
        success: 0,
        message: 'Saved data failed'
      });
    } else {
      res.json({
        success: 1,
        message: 'Saved data OK',
        data: _.pick(saveUser, ['username', '_id', '__v'])
      });
    }
  });
  };

  User.findOne({username: username}, function(err, user) {
    if (err) {
      res.json({success: 0, message: "Database error, could not find user"});
    } else {
      if(user) {
        res.json({success: 0, message: "Register failed, duplicate user"});
      } else {
        saveUser(username, password);
      }
    }
  });

});

app.post('/api/gxtg', function(req, res) {
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
