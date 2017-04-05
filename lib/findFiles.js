const gs = require('glob-stream')
module.exports = function(globs) {
    console.log(`Find Files with pattern: "${globs}"`)
    return gs(globs, { allowEmpty: true, matchBase: true })
}
