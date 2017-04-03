const fs = require('fs')
const split = require('split')
const miss = require('mississippi')

module.exports = function(checkOnly) {
    return miss.through.obj(function (file, enc, cb) {
            if (checkOnly) {
                console.log("Reading lines from :", file.path)
                cb(null)
            } else {
                pushLinesFromFile(file.path, this, cb)
            }
        }, function (cb) {
            cb(null)
    })
}

const pushLinesFromFile = function(path, outStream, endCb) {
    fs.createReadStream(path)
        .pipe(split())
        .on('data', function (line) {
            if (line && line.length > 0)
                outStream.push(line)
        })
        .on('end', function(line) {
            if (line && line.length > 0)
                outStream.push(line)
            endCb(null)
        })
}
