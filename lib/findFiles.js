const gs = require('glob-stream')
module.exports = function(globs) {
    return gs(globs, { allowEmpty: true, matchBase: true })
}
