const miss = require('mississippi')
const fs = require('fs')

module.exports = miss.through.obj(function (obj, enc, cb) {
    //console.log("Pushing object to ElasticSearch :", obj)
    console.log(JSON.stringify(obj, null, ''))
    // TODO: use REST API to upload the object
    cb(null, obj)
}, function (cb) {
    cb(null)
})
