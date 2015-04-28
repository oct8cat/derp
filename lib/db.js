'use strict';

var _ = require('lodash')

/**
 * @alias Derp.Db
 * @constructor
 */
var Db = module.exports = function Db () {
}

/**
 * @param {function} fn
 */
Db.models = function (fn) {
    fn.call(Db, Db.mongoose)
    return Db
}

/**
 */
Db.model = Db.m = function () {
    return Db.mongoose.model.apply(Db.mongoose, arguments)
}
