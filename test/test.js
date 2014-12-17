'use strict';

/* global describe, it, before, after */
/* jshint expr: true */

var derp = require('../lib/derp'),
    should = require('should'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    rimraf = require('rimraf'),
    async = require('async'),
    errors = require('../lib/errors')

var DB_URI = 'mongodb://localhost/derp-test',
    DIR_FIXTURES = path.join(__dirname, 'fixtures'),
    DIR_TMP = path.join(__dirname, 'tmp'),
    PATH_MODELS = path.join(DIR_FIXTURES, 'models'),
    PATH_DATA = path.join(DIR_FIXTURES, 'data')

describe('derp', function() {
    var db = derp.db,
        services = derp.services,
        models = require(PATH_MODELS),
        data = require(PATH_DATA)

    before(function(done) {
        db.init({models: models}).connect(DB_URI, function(err) {
            if (err) { done(err); return }
            db.mongoose.connection.db.dropDatabase(function(err) {
                if (err) { done(err); return }
                async.each(Object.keys(data), function(k, cb) {
                    db.mongoose.model(k).create(data[k], cb)
                }, function(err) {
                    if (err) { done(err); return }
                    mkdirp(DIR_TMP, done)
                })
            })
        })
    })

    after(function(done) {
        rimraf(DIR_TMP, function(err) {
            if (err) { done(err); return }
            db.mongoose.connection.db.dropDatabase(function(err) {
                if (err) { done(err); return }
                db.disconnect(done)
            })
        })
    })

    describe('#services', function() {
        describe('#fs', function() {
            describe('.today', function() {
                it('should return current date as YYYY-MM-DD.', function() {
                    services.fs.today().should.match(/^\d{4}-\d{2}-\d{2}$/)
                })
            })
            describe('.uniq', function() {
                it('should match pattern /^[a-f\\d]{32}(\\.[\\w]+)?$/', function() {
                    services.fs.uniq('cat.png').should.match(/^[a-f\d]{32}(\.[\w]+)?$/)
                })
            })
            describe('.pathToUrl', function() {
                it('should convert path to URL.', function() {
                    var url = '/cat.png'
                    services.fs.pathToUrl(services.fs.DIR_PUBLIC + url).should.be.equal(url)
                })
            })
            describe('.urlToPath', function() {
                it('should convert URL to path.', function() {
                    var url = '/cat.png',
                        path = services.fs.DIR_PUBLIC + url
                    services.fs.urlToPath(url).should.be.equal(path)
                })
            })
        })

        describe('#upload', function() {
            describe('.saveImage', function() {
                it('should save image without errors', function(done) {
                    var src = path.join(DIR_FIXTURES, 'cat.jpg')
                    services.upload.saveImage({path: src}, function(err, dest) {
                        if (err) { done(err); return }
                        services.fs.fs.exists(dest, function(exists) {
                            exists.should.be.ok
                            done()
                        })
                    })
                })
            })
        })

        describe('#resource', function() {
            describe('.get', function() {
                it('should retrieve resource by id.', function(done) {
                    services.resource.get('Studio', 'madhouse', function(err, studio) {
                        if (err) { done(err); return }
                        studio.should.be.ok
                        done(err)
                    })
                })
                it('should retrieve null when resource not found.', function(done) {
                    services.resource.get('Studio', '4c', function(err, studio) {
                        if (err) { done(err); return }
                        should.not.exist(studio)
                        done(err)
                    })
                })
                it('should raise DResourceNotRegisteredError {operation.name = get} when resource not registered.', function(done) {
                    services.resource.get('Movie', 'none', function(err, movie) {
                        err.should.be.instanceOf(errors.DResourceNotRegisteredError)
                        err.operation.name.should.be.equal('get')
                        done()
                    })
                })
            })

            describe('.list', function() {
                it('should retrieve array of resources', function(done) {
                    services.resource.list('Studio', function(err, studios) {
                        if (err) { done(err); return }
                        studios.should.be.an.Array.and.have.length(data.Studio.length)
                        done(err)
                    })
                })
                it('should raise DResourceNotRegisteredError {operation.name = list} when resource not registered.', function(done) {
                    services.resource.list('Movie', function(err, movie) {
                        err.should.be.instanceOf(errors.DResourceNotRegisteredError)
                        err.operation.name.should.be.equal('list')
                        done()
                    })
                })
            })

            describe('.create', function() {
                it('should raise DResourceNotRegisteredError {operation.name = create} when resource not registered.', function(done) {
                    services.resource.create('Movie', {}, function(err, movie) {
                        err.should.be.instanceOf(errors.DResourceNotRegisteredError)
                        err.operation.name.should.be.equal('create')
                        done()
                    })
                })
            })

            describe('.update', function() {
                it('should raise DResourceNotRegisteredError {operation.name = update} when resource not registered.', function(done) {
                    services.resource.update('Movie', 'none', {}, function(err, movie) {
                        err.should.be.instanceOf(errors.DResourceNotRegisteredError)
                        err.operation.name.should.be.equal('update')
                        done()
                    })
                })
            })


            describe('.remove', function() {
                it('should raise DResourceNotRegisteredError {operation.name = remove} when resource not registered.', function(done) {
                    services.resource.remove('Movie', 'none', function(err, movie) {
                        err.should.be.instanceOf(errors.DResourceNotRegisteredError)
                        err.operation.name.should.be.equal('remove')
                        done()
                    })
                })
            })


            describe('.create/.update/.remove', function() {
                it('should retrieve created/updated/removed document', function(done) {
                    var attributes = {_id: 'test', name: 'Trigger'},
                        attributes2 = {name: 'Khara'}
                    services.resource.create('Studio', attributes, function(err, studio) {
                        if (err) { done(err); return }
                        studio.name.should.be.equal(attributes.name)
                        services.resource.update('Studio', studio._id, attributes2, function(err, studio) {
                            if (err) { done(err); return }
                            studio.name.should.be.equal(attributes2.name)
                            services.resource.remove('Studio', studio._id, function(err, studio) {
                                if (err) { done(err); return }
                                studio.name.should.be.equal(attributes2.name)
                                done(err)
                            })
                        })
                    })
                })
            })
        })
    })
})
