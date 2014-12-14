function ImageService() {}
module.exports = ImageService

var gm = require('gm')

ImageService.gm = gm

ImageService.save = function(src, dest, cb) {
    gm(src).write(dest, cb)
    return ImageService
}
