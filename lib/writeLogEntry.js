const miss = require('mississippi')

module.exports = miss.through.obj(function (obj, enc, cb) {
    console.log(JSON.stringify(obj, null, ''))
    cb(null, obj)
}, function (cb) {
    cb(null)
})
