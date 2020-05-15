const msgSys        = require( './api/msgSystem.js' )
const http2         = require( 'http2' )
const fs            = require( 'fs' )
const path          = require( 'path' )
const dbQuery       = require( './api/database.js' )
const token         = require( './api/token.js' )

const dbInfo = {
    dbName: 'jord',
    userR: 'jordread',
    pwdR: '3U4m0btlu4zBnLdm4hvm9L6bUZzSs3YAY1',
    userRW: 'jordwrite',
    pwdRW: 'Pf01vVZ6QeEt9UzayAWg3Fkt7VT6z2VrdP'
}

const port = '8443'

const mimeTypes = {
    'html' : 'text/html',
    'js'   : 'text/javascript',
    'css'  : 'text/css',
    'json' : 'application/json',
    'png'  : 'image/png',
    'jpg'  : 'image/jpg',
    'gif'  : 'image/gif',
    'svg'  : 'image/svg+xml',
    'wav'  : 'audio/wav',
    'mp4'  : 'video/mp4',
    'woff' : 'application/font-woff',
    'ttf'  : 'application/font-ttf',
    'eot'  : 'application/vnd.ms-fontobject',
    'otf'  : 'application/font-otf',
    'wasm' : 'application/wasm'
}


async function parseRequest( stream, headers, req, res ) {

    req.url = new URL( headers[ ':path' ], `https://localhost:${ port }` )
    req.param = Object.fromEntries( req.url.searchParams.entries( ) )
    req.path = req.url.pathname.split('/' )
    req.path.shift( )

    stream.setEncoding('utf8' )
    req.body = ''
    for await ( const chunk of stream )
        req.body += chunk

}

async function readFile( req, res ) {

    const fileName = req.path.join( path.sep )
    let filePath = './' + ( fileName === '' ? 'index.html' : fileName )

    const ext = path.extname( filePath ).substring( 1 )

    //if (this.conf.typeAllowed instanceof Array && !this.conf.typeAllowed.includes(ext)) { throw new Error('403 Forbidden, file type not allowed') }

    res.headers[ 'content-type' ] = ( ext in mimeTypes ) ? mimeTypes[ ext ] : 'text/plain'

    try {
        res.data = await fs.promises.readFile( filePath )
    } catch ( e ) {
        if ( e.code === 'ENOENT' )
            throw new Error( '404 Not Found' )
        throw e
    }
}

async function handleRequest( req, res ) {

    // GET COLLECTION
    if ( req.url.pathname.startsWith( '/api/get' ) ) {

        if ( req.param.name === 'products' || req.param.name === 'pages' ) {

            const resp = await dbQuery.dbLoad( dbInfo.userR, dbInfo.pwdR, dbInfo.dbName, req.param )
            res.headers[ 'content-type' ] = 'application/json'
            res.data = JSON.stringify( resp )

        }

    // TOKEN
    }  else if ( req.url.pathname.startsWith( '/api/token' ) ) {

        if( req.param.action === 'verify' ){

            const resp = await token.verifyUser( req.param.token )
            res.headers[ 'content-type' ] = 'application/json'
            res.data = JSON.stringify( resp )


        } else if ( req.param.action === 'remove' ){

            token.delUser( req.param.token )

        }

    // LOGIN
    } else if ( req.url.pathname.startsWith( '/api/login' ) ) {

        const resp = await dbQuery.dbLogin( dbInfo.userR, dbInfo.pwdR, dbInfo.dbName, 'users', req.param )
        res.headers[ 'content-type' ] = 'application/json'
        res.data = JSON.stringify( resp )

    // REGISTER
    } else if ( req.url.pathname.startsWith( '/api/register' ) ) {

        const resp = await dbQuery.dbRegister( dbInfo.userRW, dbInfo.pwdRW, dbInfo.dbName, 'users', req.param )
        res.headers[ 'content-type' ] = 'application/json'
        res.data = JSON.stringify( resp )

    // UPDATE USER
    } else if ( req.url.pathname.startsWith( '/api/updateUser' ) ) {

        const tokenResp = await token.verifyUser(req.param.token)

            if( tokenResp === true ){

                const resp = await dbQuery.dbUpdateUser( dbInfo.userRW, dbInfo.pwdRW, dbInfo.dbName, 'users', req.body )
                resp.token = req.param.token
                res.headers[ 'content-type' ] = 'application/json'
                res.data = JSON.stringify( resp )

            } else {
                res.headers[ 'content-type' ] = 'application/json'
                res.data = JSON.stringify( false )
            }

    // UPDATE PASSWORD
    } else if ( req.url.pathname.startsWith( '/api/updatePwd' ) ) {

        const resp = await dbQuery.dbUpdatePassword( dbInfo.userRW, dbInfo.pwdRW, dbInfo.dbName, 'users', req.param )
        res.headers[ 'content-type' ] = 'application/json'
        res.data = JSON.stringify( resp )

    // CART
    } else if ( req.url.pathname.startsWith( '/api/cart' ) ) {

        const tokenResp = await token.verifyUser( req.param.token )

        if( tokenResp === true ){

            const resp = await dbQuery.dbCart( dbInfo.userRW, dbInfo.pwdRW, dbInfo.dbName, 'users',req.param.action ,req.param.email , req.body )
            res.headers[ 'content-type' ] = 'application/json'
            res.data = JSON.stringify( resp )

        } else {
            res.headers[ 'content-type' ] = 'application/json'
            res.data = JSON.stringify( false )
        }

    // ORDER
    } else if ( req.url.pathname.startsWith( '/api/orders' ) ) {

        const tokenResp = await token.verifyUser( req.param.token )
            if( tokenResp === true ){
                const resp = await dbQuery.dbOrders( dbInfo.userRW, dbInfo.pwdRW, dbInfo.dbName, 'orders',req.param.action , req.param.email )
                res.headers[ 'content-type' ] = 'application/json'
                res.data = JSON.stringify( resp )
            } else {
                res.headers[ 'content-type' ] = 'application/json'
                res.data = JSON.stringify( false )
            }

    } else if ( path.extname( String( req.url ) ) === '' && String( req.url.pathname ) !== '/' ) {

        res.headers[ 'Location' ] = '/#' + String( req.url.pathname ).replace( '/', '' )
        res.headers[ ':status' ] = 302

    } else {

        await readFile( req, res )

    }
}

async function executeRequest( stream, headers ) {

    // msgSys.send( JSON.stringify(stream.session.socket.remoteAddress), 'debug' )

    stream.on('error', err => msgSys.send( err, 'error' ) )

    const req = {
        headers: headers
    }

    let res = {
        data: '',
        compress: false,
        headers: {
            'server': 'Made with NodeJS by atrepp & aleclercq',
            ':status': 200
        }
    }

    try {

        // Build request object
        await parseRequest(stream, headers, req, res)

        await handleRequest(req, res, headers)

    } catch ( err ) {

        let error = err.message.match( /^(\d{3}) (.+)$/ )

        if ( error )
            error.shift( )
        else
            error = [ '500', 'Internal Server Error' ]

        res.headers[ ':status' ] = error[ 0 ]
        res.headers[ 'content-type' ] = 'text/html'
        res.data = `<h1>${error[0]} ${error[1]}</h1><pre>${err.stack}</pre>\n<pre>Request : ${JSON.stringify(req, null, 2)}</pre>`

    } finally {
        /* if(!res.cached) {
             // Compress the response using Brotli
             const paramCompress = this.conf.compression
             if(paramCompress && paramCompress.enable && req.headers['accept-encoding'].includes('br')
                 && paramCompress.mimeType.includes(res.headers['content-type']) && (paramCompress.minSize < res.data.length)) {

                 res.headers['content-encoding'] = 'br'
                 res.data = await compress(res.data, {
                     params: {
                         [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
                         [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.Z_BEST_SPEED
                     }
                 })
             }

             if(this.conf.cache?.enable && (!this.conf.cache.maxSize || (this.conf.cache.maxSize && (this.conf.cache.maxSize > res.data.length)))) {
                 res.cached = true
                 this.cache[key] = {timestamp: Date.now(), res: res}
             }
         }
 */
        stream.respond( res.headers )
        stream.end( res.data )

    }
}



const server = http2.createSecureServer( {
    key: fs.readFileSync( './localhost-privkey.pem' ),
    cert: fs.readFileSync( './localhost-cert.pem' )
} )



server.on( 'error', err => msgSys.send( err, 'error' ) )
server.on( 'stream', executeRequest )

server.listen( port );

msgSys.send( `Server is lounch at https://localhost:${port}`, 'success' )
msgSys.send( '------------------------------------' )