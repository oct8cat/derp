'use strict';

function FsService() {}
module.exports = FsService

var path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    rimraf = require('rimraf'),
    crypto = require('crypto'),
    j = path.join

FsService.DIR_PUBLIC = process.env.DIR_PUBLIC ||
        j(path.dirname(process.mainModule.filename), 'public')

FsService.DIR_UPLOADS = process.env.DIR_UPLOADS ||
        j(FsService.DIR_PUBLIC, 'uploads')

FsService.DIR_UPLOADS_IMAGES = process.env.DIR_UPLOADS_IMAGES ||
        j(FsService.DIR_UPLOADS, 'images')

FsService.path = path

FsService.fs = fs

FsService.mkdirp = mkdirp

FsService.rimraf = rimraf

FsService.j = j

FsService.today = function() {
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate()
    return [
        year,
        month < 10 ? '0' + month : month,
        day < 10 ? '0' + day : day
    ].join('-')
}

FsService.uniq = function(src, keepExt) {
    if (typeof keepExt === 'undefined') { keepExt = true }

    var uniq = crypto.createHash('md5').update(src).digest('hex')
    if (!keepExt) { return uniq }

    return uniq + path.extname(src)
}

FsService.pathToUrl = function(path) {
    return path.replace(FsService.DIR_PUBLIC, '')
}

FsService.urlToPath = function(url) {
    return j(FsService.DIR_PUBLIC, url)
}
