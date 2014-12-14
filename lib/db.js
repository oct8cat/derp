var mongoose = require('mongoose')

module.exports = {
    mongoose: mongoose,
    init: function(options) {
        if (typeof options !== 'object') { options = {} }

        var it = function(k) { this[k] = mongoose[k].bind(mongoose) }
        ~['connect', 'disconnect', 'model'].forEach(it, this)

        if (options.models) { options.models(mongoose) }



        return this
    }
}
