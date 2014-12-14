function UploadService() {}
module.exports = UploadService

var fsSrv = require('./fs'),
    imageSrv = require('./image')

UploadService.saveImage = function(image, cb) {
    var dir = fsSrv.j(fsSrv.DIR_UPLOADS_IMAGES, fsSrv.today())
    fsSrv.mkdirp(dir, function(err) {
        if (err) { cb(err); return }
        var dest = fsSrv.j(dir, fsSrv.uniq(image.path))
        imageSrv.save(image.path, dest, function(err) {
            cb(err, dest)
        })
    })
}
