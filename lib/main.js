#!/usr/bin/env node
/*jshint node: true */
'use strict';

const stream = require('stream')
const through = require('through2')
const fs = require('fs')
const split = require('split')
const glob = require("glob")

exports.execute = function(config) {
    
    const _index = config._index || 'fluentd'
    const _type = config._type || 'log'

    const debug = function(label) {
        return through.obj(function(chunk, enc, cb) {
                console.log(`${label} >> `, chunk);
                cb(null, chunk)
            })
    }
    const outFile = fs.createWriteStream(config.output)

    const findFiles = through.obj(function (path, enc, cb) {
        console.log('findFiles ', path)
        const outStream = this
                
        glob(path, {}, function (er, files) {
            files.forEach((f) => { outStream.push(f) })
            cb(null)
        })

    })

    const readLines = through.obj(function(file, enc, cb) {
        console.log('processFile:', file)
        const mp = this
        if (!config.check) {
            const lineStream = fs.createReadStream(file, { end: false })
            lineStream.resume()
                .pipe(split())
                .pipe(through.obj(function (fwd, enc, cb) {
                    mp.push(fwd)
                    cb(null)
                }))
        }
        cb(null)
    })

    const convertLine = through.obj(
        function (line, enc, cb) {
            const parts = line.toString().split('\t')
            if (Array.isArray(parts) && parts[2]) {
                const entry = JSON.parse(parts[2])
                const fwd = {"_index": _index, "_type": _type, "_score": 1, "_source": entry }
                this.push(JSON.stringify(fwd, null, '')+"\n")
                cb(null)
            } else {
                cb(null)
            }
        })

    findFiles
        .pipe(readLines)
        .pipe(convertLine)
        .pipe(outFile)

    findFiles.write(config.inputs)
}
