'use strict';

var _ = require('underscore')

module.exports = {
    timestamp: function(schema, options) {
        if (typeof options === 'undefined') { options = {} }

        var createdField = options.createdField || 'created',
            updatedField = options.updatedField || 'updated'

        var add = {}
        _.each([createdField, updatedField], function(field) { add[field] = {type: 'Date'} })
        schema.add(add)

        schema.pre('validate', function(next) {
            var date = new Date()
            this.set(updatedField, date)
            if (this.isNew) { this.set(createdField, date) }
            next()
        })
    }
}
