'use strict';

var mongoose = require('mongoose')

module.exports = {
    mongoose: mongoose,
    plugins: require('./plugins'),
    init: function(options) {
        if (typeof options !== 'object') { options = {} }

        var it = function(k) { this[k] = mongoose[k].bind(mongoose) },
            methods = ['connect', 'disconnect', 'model']

        methods.forEach(it, this)

        if (options.models) { options.models(mongoose) }

        return this
    }
}
