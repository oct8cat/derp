'use strict';

module.exports  = function(mongoose) {
    mongoose.model('Studio', new mongoose.Schema({
        _id: {type: 'String', required: true, unique: true},
        name: {type: 'String', required: true}
    }))
    mongoose.model('Film', new mongoose.Schema({
        studio: {type: 'String', required: true, ref: 'Studio'},
        title: {type: 'String', required: true},
    }))
}
