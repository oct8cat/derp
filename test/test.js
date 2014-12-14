var derp = require('../lib/derp'),
    db = derp.db,
    services = derp.services,
    should = require('should'),
    path = require('path')

var DB_URI = 'mongodb://localhost/test',
    DIR_FIXTURES = path.join(__dirname, 'fixtures'),
    DIR_TMP = path.join(__dirname, 'tmp'),
    MODEL_CAT = 'Cat',
    models = function(mongoose) {
        mongoose.model(MODEL_CAT, new mongoose.Schema({
            name: {type: 'String', required: true}
        }))
    },
    DB_PROPS = ['mongoose', 'connect', 'disconnect', 'model'],
    SRV_PROPS = ['fs', 'image', 'upload'],
    FSSRV_PROPS = [
        'DIR_PUBLIC', 'DIR_UPLOADS', 'DIR_UPLOADS_IMAGES',
        'path', 'fs', 'mkdirp',
        'j', 'today', 'uniq', 'pathToUrl', 'urlToPath'
    ],
    UPLOADSRV_PROPS = ['saveImage']

describe('derp', function() {

    describe('#db', function() {
        before(function() {
            db.init({models: models})
        })
        it('should have properties: ' + DB_PROPS, function() {
            db.should.have.properties(DB_PROPS)
        })
        it('should register models on init.', function() {
            db.model(MODEL_CAT).should.be.ok
        })
        it('should connects/disconnects without errors.', function(done) {
            db.connect(DB_URI, function(err) {
                if (err) { done(err); return }
                db.disconnect(done)
            })
        })
    })

    describe('#services', function() {
        before(function(done) { services.fs.mkdirp(DIR_TMP, done) })
        after(function(done) { services.fs.rimraf(DIR_TMP, done) })

        it('should have properties: ' + SRV_PROPS, function() {
            services.should.have.properties(SRV_PROPS)
        })
        describe('#fs', function() {
            it('should have properties: ' + FSSRV_PROPS, function() {
                services.fs.should.have.properties(FSSRV_PROPS)
            })
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
            it('should have properties: ' + UPLOADSRV_PROPS, function() {
                services.upload.should.have.properties(UPLOADSRV_PROPS)
            })
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
    })
})
