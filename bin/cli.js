#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * command-line utility
 */
(function() {
    var program = require('commander')
    var thisPackage = require(__dirname + '/../package.json')
    program._name = thisPackage.name
    var app = require('../index')

    program
        .version(thisPackage.version)
        .description('Read selected files FluentD format log entries\n  and convert them to elasticdump friendly format.')
        .option("-i, --inputs <path>", "input files", String, "")
        .option("-c, --check", "Do not convert, only lists the input files found by pattern", String, "")
        .option("-x, --index <_index>", "The _index field of the ElasticSearch entry (default: 'fluentd')", String, "")
        .option("-t, --type <_type>", "The _type field of the ElasticSearch entry (default: 'log')", String, "")
        .parse(process.argv)
    app.main.execute(program)
})();
