/* jshint mocha: true */
'use strict';

var assert = require('assert')

var Derp = require('..')

describe('Derp', function () {
    describe('.set()', function () {
        it('Should set nested objects\' options.', function () {
            var mongoose = {}
            Derp.set({Db: {mongoose: mongoose}})
            assert.equal(Derp.Db.mongoose, mongoose)
        })
        it('Should return `Derp` object itself.', function () {
            assert.equal(Derp.set(), Derp)
        })
    })
    describe('.Db', function () {
        describe('.models()', function () {
            it('Should call models initialization with `Derp.Db` context ' +
               'and mongoose passed as a first argument.', function (done) {
                var mongoose = {model: function () {}}
                var fn = function (mongoose) {
                    assert.equal(typeof mongoose.model, 'function')
                    assert.equal(this, Derp.Db)
                    done()
                }
                Derp.set({Db: {mongoose: mongoose}}).Db.models(fn)
            })
        })
        describe('.model()', function () {
            it('Should call mongoose\'s `model` method.', function (done) {
                var mongoose = {model: function () { done() }}
                Derp.set({Db: {mongoose: mongoose}}).Db.model()
            })
        })
    })
})
