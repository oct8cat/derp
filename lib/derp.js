'use strict';

var _ = require('lodash')

/**
 * API entry point.
 * @alias Derp
 * @constructor
 */
var Derp = module.exports = function Derp () {
}

Derp.Db = require('./db')

Derp.services = require('./services')

/**
 * @param {object} options
 */
Derp.set = function (options) {
    if (_.isUndefined(options)) { options = {} }
    Object.keys(options).forEach(function (k) {
        _.extend(Derp[k], options[k])
    })
    return Derp
}

/**
 * @param {string} k
 */
Derp.srv = function (k) {
    return Derp.services[k]
}
