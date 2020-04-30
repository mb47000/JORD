const dbInfo = {
    dbName: 'jord',
    userR: 'jordread',
    pwdR: '3U4m0btlu4zBnLdm4hvm9L6bUZzSs3YAY1',
    userRW: 'jordwrite',
    pwdRW: 'Pf01vVZ6QeEt9UzayAWg3Fkt7VT6z2VrdP'
}
const serverPort = '8125'

const http          = require( 'http' )
const fs            = require( 'fs' )
const path          = require( 'path' )
const url           = require( 'url' )
const qs            = require( 'querystring' )
const dbQuery       = require( './api/database.js' )
const email         = require( './api/email.js' )
const token         = require( './api/token.js' )

http.createServer( function ( req, res ) {

    let filePath = '.' + req.url

    if ( filePath == './' ) {

        filePath = './index.html'
        readFile( )

    } else if ( req.url.startsWith( '/api/get' ) ) {

        const queryObject = url.parse( req.url, true ).query

        if ( queryObject.name === 'products' || queryObject.name === 'pages' ){

            dbQuery.dbLoad( dbInfo.userR, dbInfo.pwdR, dbInfo.dbName, queryObject )
                .then( resp  => {
                    res.statusCode = 200
                    res.writeHead( 200, { 'Content-Type': 'application/json' } )
                    res.end( JSON.stringify( resp ), 'utf-8')
                } )

        }


    } else if ( req.url.startsWith( '/api/sendEmail' ) ) {

        const queryObject = url.parse( req.url, true ).query
        email.send( queryObject )


    } else if ( req.url.startsWith( '/api/login' ) ) {

        const queryObject = url.parse( req.url, true ).query
        dbQuery.dbLogin( dbInfo.userR, dbInfo.pwdR, dbInfo.dbName, 'users', queryObject )
            .then( resp => {
                res.statusCode = 200
                res.writeHead( 200, { 'Content-Type' : 'application/json' } )
                res.end( JSON.stringify( resp ), 'utf-8' )
            })


    } else if ( req.url.startsWith( '/api/register' ) ) {

        const queryObject = url.parse( req.url, true ).query
        dbQuery.dbRegister( dbInfo.userRW, dbInfo.pwdRW, dbInfo.dbName, 'users', queryObject )
            .then( resp => {
                res.statusCode = 200
                res.writeHead( 200, { 'Content-Type' : 'application/json' } )
                res.end( JSON.stringify( resp ), 'utf-8' )
            } )

    } else if ( req.url.startsWith( '/api/updateUser' ) ) {

        const queryObject = url.parse( req.url, true ).query
        console.log(queryObject)

        token.verifyUser(queryObject.token)
            .then( resp => {
                console.log( resp )
                if( resp === true ){
                    if ( req.method == 'POST' ) {

                        let body = ''

                        req.on( 'data', function ( data ) {
                            body += data
                            if ( body.length > 1e6 )
                                req.connection.destroy(  );
                        } )

                        req.on( 'end', ( ) => {
                            let post = qs.parse( body )
                            let postData = Object.keys( post )
                            postData = JSON.parse( postData )

                            dbQuery.dbUpdateUser( dbInfo.userRW, dbInfo.pwdRW, dbInfo.dbName, 'users', postData )
                                .then( resp => {
                                    resp.token = queryObject.token
                                    res.statusCode = 200
                                    res.writeHead( 200, { 'Content-Type' : 'application/json' } )
                                    res.end( JSON.stringify( resp ), 'utf-8' )
                                } )
                        } )
                    } else {
                        res.statusCode = 200
                        res.writeHead( 200, { 'Content-Type' : 'application/json' } )
                        res.end( false, 'utf-8' )
                    }
                } else {
                    res.statusCode = 200
                    res.writeHead( 200, { 'Content-Type' : 'application/json' } )
                    res.end( false, 'utf-8' )
                }
            } )

    } else if ( req.url.startsWith( '/api/token' ) ) {

        const queryObject = url.parse( req.url, true ).query
        console.log(queryObject)
        if( queryObject.action === 'verify' ){

            token.verifyUser(queryObject.token)
                .then( resp => {
                    res.statusCode = 200
                    res.writeHead( 200, { 'Content-Type' : 'application/json' } )
                    res.end( JSON.stringify( resp ), 'utf-8' )
                } )

        } else if ( queryObject.action === 'remove' ){

            token.delUser(queryObject.token)

        }

    } else if ( String( path.extname( req.url ) ) === '' ) {

        res.writeHead( 302, { 'Location': '/#' + req.url.replace( '/', '' ) } )
        res.end()

    } else {

        readFile()

    }


    function readFile( ){

        let extname = String( path.extname( filePath ) ).toLowerCase( )

        let mimeTypes = {
            '.html' : 'text/html',
            '.js'   : 'text/javascript',
            '.css'  : 'text/css',
            '.json' : 'application/json',
            '.png'  : 'image/png',
            '.jpg'  : 'image/jpg',
            '.gif'  : 'image/gif',
            '.svg'  : 'image/svg+xml',
            '.wav'  : 'audio/wav',
            '.mp4'  : 'video/mp4',
            '.woff' : 'application/font-woff',
            '.ttf'  : 'application/font-ttf',
            '.eot'  : 'application/vnd.ms-fontobject',
            '.otf'  : 'application/font-otf',
            '.wasm' : 'application/wasm'
        };

        let contentType = mimeTypes[extname] || 'application/octet-stream'

        fs.readFile( filePath, function( error, content ) {
            res.writeHead( 200, { 'Content-Type': contentType } )
            res.end( content, 'utf-8' )
        })
    }

}).listen( serverPort )

console.log( `Server running at http://127.0.0.1:${serverPort}/`)


