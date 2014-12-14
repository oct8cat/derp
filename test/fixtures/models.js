'use strict';

module.exports  = function(mongoose) {
    mongoose.model('Cat', new mongoose.Schema({
        name: {type: 'String', required: true}
    }))
}
