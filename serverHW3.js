// BASE setup

// call packages
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var port        = process.env.PORT || 8080;
var GithubAPI   = require("github");

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

// Routes for API

// home page route
app.get('/', function(req, res){
    res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// middleware to use for all the requests
apiRouter.use(function (req, res, next) {
    // do logging
    console.log('Someone visited a page on the site');

    next();
});

apiRouter.get('/github', function(req, res){

    var github = new GithubAPI({
        version: "3.0.0"
    });

    var token = "github_token";

        github.authenticate({
            type: "oauth",
            token: token
        });

        github.users.getFollowingForUser({
            username: "kelseyrocklin"
        }, function(err, resp){
            console.log(JSON.stringify(resp));
            res.json(resp);
        })
});

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
    res.json({message: 'this is the api home page'});
});

// more routes here

// register our routes
// all routes prefixed with /api
app.use('/api', apiRouter);

// start the server
app.listen(port);
console.log('Server located on port ' + port);
