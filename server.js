var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies')

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'});
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code === 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'});
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        });
    });
});

router.post('/movies', function(req, res) {
    if(!req.body) {
        res.send({success: false, msg:'No body.'});
    }
    else if (!authJwtController.isAuthenticated) {
        res.status(401).send({success: false, msg: 'Authentication failed.'});
    }
    else if (!req.body.title || !req.body.releaseYear || !req.body.genre || !req.body.actors) {
        res.send({success: false, msg: 'Required field missing.'});
    }
    else if (!req.body.actors.actor1 || !req.body.actors.actor2 || !req.body.actors.actor3) {
        res.send({success: false, msg: 'Movie must have 3 actors.'});
    }
    else if (!req.body.actors.actor1.name || !req.body.actors.actor1.role) {
        res.send({success: false, msg: 'Actor 1 must have a name and role.'});
    }
    else if (!req.body.actors.actor2.name || !req.body.actors.actor2.role) {
        res.send({success: false, msg: 'Actor 2 must have a name and role.'});
    }
    else if (!req.body.actors.actor3.name || !req.body.actors.actor3.role) {
        res.send({success: false, msg: 'Actor 3 must have a name and role.'});
    }
    else {
        let movieNew = new Movie();
        movieNew.title = req.body.title;
        movieNew.releaseYear = req.body.releaseYear;
        movieNew.genre = req.body.genre;
        movieNew.actors.actor1.name = req.body.actors.actor1.name;
        movieNew.actors.actor1.role = req.body.actors.actor1.role;
        movieNew.actors.actor2.name = req.body.actors.actor2.name;
        movieNew.actors.actor2.role = req.body.actors.actor2.role;
        movieNew.actors.actor3.name = req.body.actors.actor3.name;
        movieNew.actors.actor3.role = req.body.actors.actor3.role;
        movieNew.save(function(err, result) {
            if(err) {
                res.send(err);
            }
            else {
                res.json({success: true, msg: 'Saved movie.'})
            }
        });
    }
});

router.put('/movies/:id', function(req, res) {
    if(!req.body) {
        res.send({success: false, msg:'No body.'});
    }
    else if (!authJwtController.isAuthenticated) {
        res.status(401).send({success: false, msg: 'Authentication failed.'});
    }
    else if (!req.body.title || !req.body.releaseYear || !req.body.genre || !req.body.actors) {
        res.send({success: false, msg: 'Required field missing.'});
    }
    else if (!req.body.actors.actor1 || !req.body.actors.actor2 || !req.body.actors.actor3) {
        res.send({success: false, msg: 'Movie must have 3 actors.'});
    }
    else if (!req.body.actors.actor1.name || !req.body.actors.actor1.role) {
        res.send({success: false, msg: 'Actor 1 must have a name and role.'});
    }
    else if (!req.body.actors.actor2.name || !req.body.actors.actor2.role) {
        res.send({success: false, msg: 'Actor 2 must have a name and role.'});
    }
    else if (!req.body.actors.actor3.name || !req.body.actors.actor3.role) {
        res.send({success: false, msg: 'Actor 3 must have a name and role.'});
    }
    else {
        Movie.updateOne({_id: req.params.id}, {
            title: req.body.title,
            releaseYear: req.body.releaseYear,
            genre: req.body.genre,
            actors: {
                actor1: {
                    name: req.body.actors.actor1.name,
                    role: req.body.actors.actor1.role
                },
                actor2: {
                    name: req.body.actors.actor2.name,
                    role: req.body.actors.actor2.role
                },
                actor3: {
                    name: req.body.actors.actor3.name,
                    role: req.body.actors.actor3.role
                }
            }
        },function(err, result) {
            if(err) {
                res.send(err);
            }
            else {
                res.json({success: true, msg: 'Saved movie.'})
            }
        });
    }
});

router.get('/movies', function(req, res) {
    if(!authJwtController.isAuthenticated) {
        res.status(401).send({success: false, msg: 'Authentication failed.'});
    }
    else {
        Movie.find(function(err, movies) {
            if(err) {
                res.send(err);
            }
            else {
                res.json({success: true, movieList: movies});
            }
        });
    }
});

router.get('/movies/:id', function(req, res) {
    if(!authJwtController.isAuthenticated) {
        res.status(401).send({success: false, msg: 'Authentication failed.'});
    }
    else {
        Movie.findOne({_id: req.params.id}, function(err, movie) {
            if(err) {
                res.send(err);
            }
            else {
                res.json({success: true, movie: movie});
            }
        });
    }
});

router.delete('/movies/:id', function(req, res) {
    if(!authJwtController.isAuthenticated) {
        res.status(401).send({success: false, msg: 'Authentication failed.'});
    }
    else {
        Movie.deleteOne({_id: req.params.id}, function(err){
            if(err) {
                res.send(err);
            }
            else {
                res.json({success: true, msg: 'Deleted movie'});
            }
        });
    }
});

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only