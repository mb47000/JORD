#!/usr/bin/env node
const msgSys = require( './api/msgSystem.js' )

const Terser = require('terser');
const fs = require('fs');
const root = 'src/js/';
const scripts = [
    'import.js',
    'router.js',
    'products.js',
    'layoutsParts.js',
    'pushNotification.js',
    'modal.js',
    'cart.js',
    'account.js',
    'purchase.js',
]
let destFile = process.argv.pop();

let compil = ( curr, prev ) => {

    try {

        let dist = scripts.map( script => fs.readFileSync( root + script, { encoding: 'utf8' } ) ).join( '\n' )

        if ( process.argv.includes( '--compress' ) )
            dist = Terser.minify( dist ).code

        fs.writeFileSync( destFile, dist )

    } catch ( e ) {

        msgSys.send( e, 'error' )

    } finally {

        msgSys.send('Compiling Javascript Done with success !', 'success')

    }

}

if ( process.argv.includes( '--watch' ) ){

    msgSys.send( `Ready to compil files : `, 'info' )
    msgSys.send( `---------------`, 'info' )
    scripts.forEach( e => {
        fs.watchFile(root + e, compil)
        msgSys.send( e, 'info')
    } )
    msgSys.send( `---------------`, 'info' )
    msgSys.send( `Toward [${ destFile }]`, 'info' )
    msgSys.send( 'JS is now watching for Change' )

} else {

    compil( )

}

