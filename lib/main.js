#!/usr/bin/env node
/*jshint node: true */
'use strict';

const miss = require('mississippi')
const findFiles = require('./findFiles')
const readLines = require('./readLines')
const convertLine = require('./convertLine')
const writeLogEntry = require('./writeLogEntry')

/**
 * @param  {Object} config   Configuration parameters
 */
exports.execute = function(config) {
    miss.pipe(
        findFiles(config.inputs),
        readLines(config.check),
        convertLine(config.index || 'fluentd', config.type || 'log'),
        writeLogEntry,
        errorHandler)
};

const errorHandler = function (err) {
    if (err) {
        console.error('Processing error!', err)
    }
}

