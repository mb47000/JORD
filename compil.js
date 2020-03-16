#!/usr/bin/env node

// const process = require('process')
const Terser = require('terser');
const fs = require('fs');
const root = 'src/js/';
const scripts = [
    'layoutsParts.js',
    'router.js'
];
let destFile = process.argv.pop();


let compil = (curr, prev) => {
    console.error('Compiling...')
    try {

        let dist = scripts.map(script => fs.readFileSync(root + script, {encoding: 'utf8'})).join('\n')

        if( process.argv.includes('--compress') )
            dist = Terser.minify(dist).code

        fs.writeFileSync(destFile,dist);

    } catch (e) {
        console.error(e)
    }
    console.error('Compil Done!')
}

if( process.argv.includes('--watch') ){
    console.error('JS is watching for Change');
    scripts.forEach(e => fs.watchFile(root + e, compil) );
} else {
    compil();
}
