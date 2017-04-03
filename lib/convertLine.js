const miss = require('mississippi')


module.exports = function(_index, _type) {
    return miss.through.obj(function (line, enc, cb) {
        const entry = JSON.parse(line.toString().split('\t')[2])
        const fwd = {"_index": _index, "_type": _type, "_score":1, "_source": entry }

        cb(null, fwd)
    }, function (cb) {
        cb(null)
    })
}
