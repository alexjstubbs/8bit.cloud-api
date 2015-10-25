"use strict";

var _ = require('lodash');

/*
 * runDiff
 * 
 * Description: Runs a diff on an Object against defined Schema
 *
 * @param: obj            : the Object to run against Schema (object) 
 * @param: schemaInstance : the Schema to be diff'd against  (object) 
 * 
 */

module.exports = (obj, schemaInstance) => {

    let diffObj   = obj,
        queryDiff = _.difference(_.keysIn(schemaInstance.schema.properties), _.keysIn(obj));

    return Promise.all(queryDiff.map((key) => {
        let defaultValue = schemaInstance.schema.properties[key].default;

        if (typeof(defaultValue) === 'undefined') {
            return;
        }
        else {
            return diffObj[key] = schemaInstance.schema.properties[key].default;
        }

    })).then(() => {
        return diffObj;
    });

}