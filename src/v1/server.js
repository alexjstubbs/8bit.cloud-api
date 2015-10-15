/* 
 * API server for Ignition Clients
 * V1.1
 */


var http                = require('http')
,   https               = require('https')
,   express             = require('express')
,   r                   = require('rethinkdb')
,   app                 = express()
,   server              = require('http').Server(app)
,   _                   = require('lodash')
,   bodyParser          = require('body-parser')
,   cookieParser        = require('cookie-parser')
,   session             = require('express-session')
,   morgan              = require('morgan')
,   methodOverride      = require('method-override')
,   passport            = require('passport')
,   LocalStrategy       = require('passport-local').Strategy
,   socketioJwt         = require("socketio-jwt")
,   token               = require('./token')
,   sockets             = require('./socket.api')
,   bcrypt              = require('bcrypt')
,   needle              = require('needle')
,   errors              = require('./errors').error
,   fs                  = require('fs')
,   config              = require('./config.json')
,   User
,   newToken;

// Sockets
global.__io             = require('socket.io')(server);
global.__sio            = __io.listen(6052);

// Global Error Handler
process.on('uncaughtException', function (err) {
  console.log(err.stack);
});

// Accept User Connections
sockets.userConnection();

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

app.use(session({ secret: config.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


/* Local Auth Strategy
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

        r.db("ignition").table("Users").filter({Usernames: username}).run(conn, function(err, user) {
            
            if (err) { return done(err); }
            
            console.log("user," user);

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

