'use strict';

/*
 * Ignition API Server
 *
 * Apache License 2.0 (Apache-2.0)
 * Copyright (c) Alexander Stubbs, ignition.io. All Rights Reserved.
 * 
 * Contact: admin@ignition.io (alex@alexstubbs.com)
 */

var models      = require('./models'),
    api         = require('./controllers'),
    sockets     = require('./controllers/sockets'),
    db          = require('./controllers/db'),
    log         = require('./controllers/logging'),
    compress    = require('koa-compress'),
    json        = require('koa-json'),
    serve       = require('koa-static'),
    bodyParser  = require('koa-body')(),
    Router      = require('koa-router'),
    koa         = require('koa'),
    path        = require('path'),
    Promise     = require('bluebird'),
    app         = module.exports = koa(),
    server      = require('http').createServer(app.callback());

    app.name    = 'Ignition API Server';
    app.env     = 'Development';
    app.version = 'v1';

/*
 * Anti-pattern globals neccesary for now
 */

GLOBAL.$io      = require('socket.io')(server);
GLOBAL.$sio     = $io.listen(6052);
GLOBAL.$nsp     = $io.of('/network');

/*
 * Start accepting socket connections (socket.io)
 */

sockets.userConnection();

/*
 * Routing set up
 */

var router = new Router({
  prefix: `/api/${app.version}`
});

/*
 * Middleware
 */

app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(compress())
    .use(json());

/*
 * Start Server
 */

if (!module.parent) {
  app.listen(3000);
  log.debug('listening on port 3000');
}

/*
 * Error Handling
 */

app.on('error', function(err){
  log.error('server error', err);
});

process.on('uncaughtException', function (err) {
  log.error(err.stack);
});

/*
 * Routing Rules
 */

router.post('/signup', bodyParser,
    function *(next) {
        let self = this;
        yield api.postEndpoint('user', 'create', self);
    }
);

router.post('/login', bodyParser,
    function *(next) {
        let self = this;
        yield api.postEndpoint('user', 'login', self);
    }
);


