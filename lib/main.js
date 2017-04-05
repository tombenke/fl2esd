#!/usr/bin/env node
/*jshint node: true */
'use strict';

const through = require('through2')
const fs = require('fs')
const split = require('split')
const findFiles = require('./findFiles')

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

    const convertLine = through.obj(
        function (line, enc, cb) {
//            console.log("convertLine: ")
//            console.log(`from: '${line}'`)
            const parts = line.toString().split('\t')
            if (Array.isArray(parts) && parts[2]) {
                const entry = JSON.parse(parts[2])
                const fwd = {"_index": _index, "_type": _type, "_score": 1, "_source": entry }
//                console.log("to: ", fwd)
                outFile.write(JSON.stringify(fwd, null, '')+"\n")
                //this.push(JSON.stringify(fwd, null, '')+"\n")
                cb(null)
            } else {
                cb(null)
            }
        })

    const processFile = function(check) {
        return through.obj(
            function (file, enc, cb) {
                const mp = this
                console.log('processFile :', file.path)
                if (!check) {
                    fs.createReadStream(file.path)
                        .pipe(split())
//                        .pipe(debug('split'))
                        .pipe(convertLine)
//                        .pipe(debug('convertLine'))
//                        .pipe(through.obj(function (fwd, enc, cb) { cb(null, JSON.stringify(fwd, null, '')+"\n") }))
//                        .pipe(outFile)
                }
                cb(null, file.path)
            }, function (cb) {
//                console.log('processFile flush')
                cb(null)
            })
    }

    findFiles(config.inputs)
//        .pipe(debug('findFiles'))
        .pipe(processFile(config.check))
        .pipe(debug('processFile'))
};
