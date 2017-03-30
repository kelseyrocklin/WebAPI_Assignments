// BASE setup

// call packages
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var port        = process.env.PORT || 8080;

// pulls in the movie model
var Movie        = require('./app/models/movie');

// App config
// uses body-parser so we can grab info from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure the app to handle cors requests - GET/POST
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, /Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to the database
mongoose.connect('mongodb://kelsey:r3plenish@ds157459.mlab.com:57459/krocklintest');

// Routes for API

// get an instance of the express router
var apiRouter = express.Router();

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
    res.json({message: 'Welcome to the api. Valid routes are /movies or /:movie_id'});
});

// more routes here

// on routes that end in /movies
apiRouter.route('/movies')

    // create a movie
    .post(function(req, res){

        // create a new instance of the movie model
        var movie = new Movie();

        // set the movie's information (comes from the request)
        movie.name = req.body.name;
        movie.year = req.body.year;
        movie.actors = req.body.actor;

        // save the movie and check for errors
        movie.save(function(err){
            if(err){
                res.json({message: 'Every field is required.' + ' Error: ' + err});
            }
            else res.json({message: 'Movie created!'});

        });
    })
    // end .post function

    // get all the movies
    .get(function(req, res){
        Movie.find(function(err, movies){
            if(err) res.send(err);

            //returns all the movies
            res.json(movies);
        });
    })

    .put(function(req, res){
        res.json({ message: 'PUT is not a valid command. Valid commands are GET and POST'});
    })

    .delete(function(req, res){
        res.json({ message: 'DELETE is not a valid command. Valid commands are GET and POST' });
    }); // semi-colon at the end of all the http word functions

// on routes that end in /movies/:name

apiRouter.route('/movies/:movie_id')

    // get the movie with that id
    // accessed at GET http://localhost:8080/api/movies/:movie_id
    .get(function (req, res) {
        Movie.findById(req.params.movie_id, function(err, movie){

            if (err) res.send(err);

            //return that movie
            res.json(movie);
        });
    })

     .put(function (req, res) {

        // use the model to find the movie we want
        Movie.findById(req.params.movie_id, function(err, movie){

            if(err) res.send(err);

            // update the movie's info only if it's new
            if (req.body.name) movie.name = req.body.name;
            if (req.body.year) movie.year = req.body.year;
            if (req.body.actor) movie.actors = req.body.actor;

            // save the movie
            movie.save(function(err){
                if(err) res.send(err);

                // return a message
                res.json({message: 'Movie updated!'});
            });
        });
     })

     // delete the movie with this id
     // accessed at DELETE http://localhost:8080/movies/:movie_id
    .delete(function (req, res) {
        Movie.remove({
            _id: req.params.movie_id
        }, function(err, movie){
            if (err) return res.send(err);

            res.json({message: 'Successfully deleted'});
        });
    })

    .post(function(req, res){
        res.json({ message: 'POST is not a valid command. Valid commands are GET, PUT and DELETE'});
    });

// register our routes
app.use('/', apiRouter);

// start the server
app.listen(port);
console.log('Server located on port ' + port);