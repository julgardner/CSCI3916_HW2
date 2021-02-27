var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport')
var db = require('./db')()
var jwt = require('jsonwebtoken');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    }

    if(req.body != null) {
        json.body = req.body;
    }

    if(req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if(!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to register.'})
    }
    else {
        var newUser = {
            username: req.body.username,
            password: req.body.password
        };

        db.save(newUser);
        res.json({success: true, msg: "Created new user."})
    }
});

router.post('/signin', function(req, res) {
    var user = db.findOne(req.body.username);

    if(!user) {
        res.status(401).send({success: false, msg: "Authentication failed."})
    }
    else {
        if(req.body.password == user.password) {
            var userToken = {id: user.id, username: user.username};
            var token = jwt.sign(userToken, process.env.SECRET_KEY);
            res.json({success: true, token: 'JWT ' + token})
        }
        else {
            res.status(401).send({success: false, msg: "Authentication failed."})
        }
    }
});

app.use('/', router);
app.listen(process.env.PORT || 8000)
module.exports = app;