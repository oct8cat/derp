'use strict';

// TODO: Middleware option.

function ResourceService() {}
module.exports = ResourceService

var db = require('../db'),
    errors = require('../errors'),
    resolveModel = function(name, cb) {
        try {
            cb(null, db.model(name))
        } catch (err) {
            var err2 = new errors.DResourceNotRegisteredError()
            err2.rawError = err
            err2.resourceName = name
            cb(err2)
        }
    }

ResourceService.get = function(name, id, options, cb) {
    if (typeof options === 'function') { cb = options; options = {} }
    resolveModel(name, function(err, model) {
        if (err) {
            err.operation = {name: 'get', params: {id: id, options: options}};
            cb(err); return
        }
        model.findById(id).populate(options.populate || '').exec(cb)
    })
    return ResourceService
}

ResourceService.list = function(name, options, cb) {
    if (typeof options === 'function') { cb = options; options = {} }
    resolveModel(name, function(err, model) {
        if (err) {
            err.operation = {name: 'list', params: {options: options}};
            cb(err); return
        }
        model.find(options.where || {})
                .sort(options.sort || '')
                .skip(options.skip || 0)
                .limit(options.limit || 0)
                .populate(options.populate || '')
                .exec(cb)
    })
    return ResourceService
}

ResourceService.update = function(name, id, attributes, options, cb) {
    if (typeof options === 'function') { cb = options; options = {} }
    resolveModel(name, function(err, model) {
        if (err) {
            err.operation = {name: 'update', params: {id: id, attributes: attributes, options: options}};
            cb(err); return
        }
        db.model(name).findByIdAndUpdate(id, attributes, cb)
    })
    return ResourceService
}

ResourceService.create = function(name, attributes, options, cb) {
    if (typeof options === 'function') { cb = options; options = {} }
    resolveModel(name, function(err, model) {
        if (err) {
            err.operation = {name: 'create', params: {attributes: attributes, options: options}};
            cb(err); return
        }
        model.create(attributes, cb)
    })
    return ResourceService
}

ResourceService.remove = function(name, id, options, cb) {
    if (typeof options === 'function') { cb = options; options = {} }
    resolveModel(name, function(err, model) {
        if (err) {
            err.operation = {name: 'remove', params: {id: id, options: options}};
            cb(err); return
        }
        model.findByIdAndRemove(id, cb)
    })
    return ResourceService
}
