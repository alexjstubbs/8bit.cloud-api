'use strict';

/*
 * 
 * API Server for Ignition Clients
 *
 */

 var  models    = require('../models'),
      db        = require('./db'),
      Promise   = require('bluebird'),
      _         = require('lodash');

/*
 * mapArguments
 * 
 * description: Takes any number of arguments, produces passable arguement list
 *
 * @param: args :  (array) 
 * 
 */

function mapArguments(args) {
    return Promise.all(_.keysIn(args).map((key) => {
        return args[key];
     })).then((array) => {
        return array.toString();
    });
}


/*
 * returnResouce
 * 
 * description: Promise Chain that Returns Requested Public Resouce 
 *
 * @param: model    : Model to Query    (string) 
 * @param: method   : Model Method      (string) 
 * @param: ...rest  : Rest Parameters   (*)
 * 
 */


function returnResource(model, method, args) {

     // Promise Chain
     return new Promise((resolve, reject) => { 

            db.connection()

            .then((connection) => {
                return models[model][method](connection, args);
            })

            .then((result) => {
                resolve(result);
            })

            .catch((error) => {
                resolve(error);
            });

    });

}

/*
 * Single entry point for GET routing response
 * 
 * description: Returns requested resouce 
 *
 * @param: model    : Model to Query     (string) 
 * @param: method   : Model Method       (string) 
 * @param: params   : Request Parameters (*)
 * 
 */

exports.getEndpoint = function* (model, method, self) {
    let params = yield mapArguments(self.params);
    self.type  = 'application/json';
    self.body  = yield returnResource(model, method, params);
}

/*
 * Single entry point for POST routing response
 * 
 * description: Returns requested resouce 
 *
 * @param: model    : Model to Query     (string) 
 * @param: method   : Model Method       (string) 
 * @param: params   : Request Parameters (*)
 * 
 */

exports.postEndpoint = function* (model, method, self) {
    self.type  = 'application/json';
    self.body  = yield returnResource(model, method, self.request.body);
}
