#!/usr/bin/env node

const process = require('process')
const fs = require('fs');
try {
    let root = 'src/js/';
    let scripts = [
        'script1.js',
        'script2.js'
    ];
    let dist = scripts.map(script => fs.readFileSync(root + script, {encoding: 'utf8'})).join('\n')

    process.stdout.write(dist);

} catch (e) {
    console.log(e)
}