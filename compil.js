#!/usr/bin/env node
const msgSys    = require( './server/msgSystem.js' )
const Terser    = require( 'terser' )
const fs        = require( 'fs' )

const scripts = [
    'src/js/import.js',
    'src/js/router.js',
    'src/js/products.js',
    'src/js/layoutsParts.js',
    'src/js/pushNotification.js',
    'src/js/modal.js',
    'src/js/cart.js',
    'src/js/account.js',
    'src/js/purchase.js',
]

scripts.push( 'public/assets/script.js' )

let destFile = process.argv.pop();

let compil = ( curr, prev ) => {

    try {

        let dist = scripts.map( script => fs.readFileSync( script, { encoding: 'utf8' } ) ).join( '\n' )

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
        fs.watchFile( e, compil)
        msgSys.send( e, 'info')
    } )
    msgSys.send( `---------------`, 'info' )
    msgSys.send( `Toward [${ destFile }]`, 'info' )
    msgSys.send( 'First Javascript Compil' )
    compil( )
    msgSys.send( 'JS is now watching for Change...' )

} else {

    compil( )

}

