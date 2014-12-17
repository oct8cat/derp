var inherits = require('util').inherits

function DTypeError() { TypeError.apply(this, arguments); this.name = 'DTypeError' }
inherits(DTypeError, TypeError)

function DResourceNotRegisteredError() { DTypeError.apply(this, arguments); this.name = 'DResourceNotRegisteredError' }
inherits(DResourceNotRegisteredError, DTypeError)

module.exports = {
    DTypeError: DTypeError,
    DResourceNotRegisteredError: DResourceNotRegisteredError
}
