/* Database Server
-------------------------------------------------- */

var http                = require('http')
,   https               = require('https')
,   express             = require('express')
,   app                 = express()
,   server              = require('http').Server(app)
,   _                   = require('lodash')
,   restify             = require('express-restify-mongoose')
,   mongoose            = require('mongoose')
,   bodyParser          = require('body-parser')
,   cookieParser        = require('cookie-parser')
,   session             = require('express-session')
,   methodOverride      = require('method-override')
,   Schema              = mongoose.Schema
,   ObjectId            = Schema.ObjectId
,   init                = require('./init')
,   schedule            = require('node-schedule')
,   passport            = require('passport')
,   LocalStrategy       = require('passport-local').Strategy
,   morgan              = require('morgan')
,   connect             = require('connect')
,   flash               = require('connect-flash')
,   jwt                 = require('jsonwebtoken')
,   socketioJwt         = require("socketio-jwt")
,   token               = require('./token')
,   sockets             = require('./socket.api')
,   bcrypt              = require('bcrypt')
,   bunyan              = require('bunyan')
,   methods             = require('./methods')
,   needle              = require('needle')
,   errors              = require('./errors').error
,   fs                  = require('fs')
,   RateLimit           = require('express-rate-limit')
,   User
,   newToken;


global.__log            = bunyan.createLogger({name: 'ignition-server', streams: [{path: './server.log'}]})
global.__models         = require('./models')(mongoose);
global.__io             = require('socket.io')(server);
global.__sio            = __io.listen(6052);

// Global Error Handler
process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

sockets.userConnection();

/*  Rate Limiting Config
-------------------------------------------------- */

var limiter = RateLimit({
    // window, delay, and max apply per-ip unless global is set to true
    windowMs: 60 * 1000, // miliseconds - how long to keep records of requests in memory
    delayMs: 10, // milliseconds - base delay applied to the response - multiplied by number of recent hits from user's IP
    max: 1250, // max number of recent connections during `window` miliseconds before (temporarily) bocking the user.
    global: false // if true, IP address is ignored and setting is applied equally to all requests
});


// Define our Mongoose Connection as "DB"
var db = mongoose.connection;

// Errors?
db.on('error', console.error);

// On first/run do this...
db.once('open', function() {
    // init(__models);
});

// Connect to central DB
mongoose.connect('mongodb://localhost/ignition');

/* Scheduling (CRON)
-------------------------------------------------- */

// Every Month, Check Community Events (Racketboy)
var rule = new schedule.RecurrenceRule()
rule.date = 1;

var j = schedule.scheduleJob(rule, function() {
    // init(__models);
})

/* App and Server
-------------------------------------------------- */

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'digdug' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(limiter);


/* Local Auth Strategy (mongo)
-------------------------------------------------- */

passport.serializeUser(function(user, done) {
    console.log("Issued new token to: " +user.Username)
    done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    __models.User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local', new LocalStrategy({

    usernameField: 'Username',
    passwordField: 'validPassword',

    },

  function(username, password, done) {


    __models.User.findOne({ Username: username }, function (err, user) {


        if (err) { return done(err); }

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        if (!bcrypt.compareSync(password, user.validPassword)) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);

    });

    }

));


/* Routing
-------------------------------------------------- */

/* Signup
-------------------------------------------------- */

app.post('/signup', function(req, res, next) {

    var hash = bcrypt.hashSync(req.body.validPassword, 10);

    // Client passed User Object
    var userObject = {
        Username:       req.body.Username,
        validPassword:  hash,
        Email:          req.body.Email,
        Avatar:         req.body.Avatar
    };


    // Object contained a null value
    if (!req.body.Username && !req.body.validPassword && !req.body.Email && !req.body.Avatar)   {

            var error = errors('incomplete_request');

            res.status(500).json(error);

    }

    else {

        methods.newProfile(userObject, function(status) {

            if (status.profile) {


                // Cleaned User OBJ for local save on client
                var profile = {
                    Username:       status.profile.Username,
                    Email:          status.profile.Email,
                    Avatar:         status.profile.Avatar
                }

                res.status(200).json({profile: profile});

            }

            else {

                res.status(500).json(status);

            }
        })
    };

});


/* Login
-------------------------------------------------- */

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
        return next(err);
    }

    if (!user) {
        return res.send("could not authenticate");
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
    }

     newToken = token.issueToken({id: user._id});
     return res.send({token: newToken});

    });
  })(req, res, next);
});


/* Get Sockets
-------------------------------------------------- */
app.post('/sockets', function(req, res){

    token.verifyToken(req.body.token, function(err, success) {

        if (err) {

            console.log("Invalid Token");
            res.send({error: "Invalid token."});

            res.end();
            return false;

        }

        else {

            res.status(200).json({response: 'success'});
            res.end();

        }

    });

        res.end();
})


/* Log out
-------------------------------------------------- */
app.post('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

/* Log out
-------------------------------------------------- */
app.get('/rate', function(req, res){
    res.send({error: "Invalid token."});

});

/* Community HTTP Serve
-------------------------------------------------- */
restify.serve(app, __models.Community, {
    strict: true
});

/* Server/Ignition Events Serve
-------------------------------------------------- */
restify.serve(app, __models.Events, {
    strict: true
});

/* User
-------------------------------------------------- */
restify.serve(app, __models.User, {
    strict: true,
    private: 'validPassword,Email,Token',
    contextFilter: function(model, req, callback) {
       if (!User) {
        callback(model);
       }
       else {
        req.res.send("Unauthorized")
       }
    }
});


/* TLS Server
-------------------------------------------------- */

var options = {
    key:  fs.readFileSync('certs/private-key.pem'),
    cert: fs.readFileSync('certs/public-cert.pem')
};

// https.createServer(options, app).listen(3000, function() {
//     console.log("Express server listening on port 3000");
// });

// http.createServer(app).listen(3000, function() {
//     console.log("Express server listening on port 3000");
// });

var server = https.createServer(options, app).listen(3000, function(){
    console.log("server started at port 3000");
});
