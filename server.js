const msgSys    = require( './api/msgSystem.js' )
const http2     = require( 'http2' )
const fs        = require( 'fs' )
const path      = require( 'path' )
const db        = require( './server/database.js' )
const config    = require( './public/assets/config.json' )
const token     = require( './server/token.js' )
const user      = require( './server/user.js' )

/**
 * Manage Server & Request
 * @class
 */
class Server {
    /**
     * Prepare Server
     * @constructor
     */
    constructor() {
        this.port = '3001'
        this.mimeTypes = {
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
        this.enableCollection = ['products', 'pages']

    }
    /**
     * Start the server
     * @method
     */
    async start() {
        this.server = http2.createSecureServer( {
            key: fs.readFileSync( './localhost-privkey.pem' ),
            cert: fs.readFileSync( './localhost-cert.pem' )
        } )
        this.server.on( 'error', error => msgSys.send( error, 'error' ) )
        this.server.on( 'stream', await this.execRequest )
        this.server.listen( this.port )

        msgSys.send( `Server is launch at https://localhost:${ this.port }`, 'success' )
        msgSys.send( '------------------------------------' )
    }
    /**
     * Execute the Request
     * @method
     * @param [stream]
     * @param [headers]
     * @returns {Promise<void>}
     */
    async execRequest( stream, headers ) {
        await msgSys.send('exec', 'debug')
        // msgSys.send( JSON.stringify(stream.session.socket.remoteAddress), 'debug' )
        this.req = { headers: headers }
        this.res = {
            data: '',
            compress: false,
            headers: {
                'server': 'FRIGG - Server made with NodeJS Vanilla by a.Leclercq',
                ':status': 200
            }
        }

        try {
            await this.parseRequest
            await this.handleRequest
        } catch ( error ) {
            await msgSys.send( error, 'error' )
            this.error = error.message.match( /^(\d{3}) (.+)$/ )
            this.error
                ? this.error.shift()
                : this.error = [ '500', 'Internal Server Error' ]
            this.res.headers[ ':status' ] = error[0]
            this.res.headers[ 'content-type' ] = 'text/html'
            this.res.data = `<h1>${ this.error[0] } ${ this.error[1] }</h1><pre>${ error.stack }</pre>\n<pre>Request : ${ JSON.stringify( this.req, null, 2 ) }</pre>`
        } finally {
            stream.respond( this.res.headers )
            stream.end( this.res.data )
        }
    }


    /**
     * Parse the Request
     * @method
     * @param [stream]
     * @param [headers]
     * @returns {Promise<void>}
     */
    async parseRequest( stream, headers ){
        await msgSys.send('parse', 'debug')
        this.req.url = new URL( headers[':path'], `https://localhost:${ this.port }` )
        this.req.param = await Object.fromEntries( this.req.url.searchParams.entries() )
        this.req.path = this.req.url.pathname.split('/' )
        this.req.path.shift( )

        stream.setEncoding('utf8' )
        this.req.body = ''
        for await ( const chunk of stream )
            this.req.body += chunk
    }

    /**
     * Handle the Request
     * @method
     * @param [headers]
     * @returns {Promise<void>}
     */
    async handleRequest( headers ) {
        await msgSys.send('handle', 'debug')
        if( this.req.url.pathname.startsWith('/api') ){

            if ( this.req.param.action === 'get' && this.enableCollection.some( this.req.param.name ) ) {

                this.prepareRequest( await db.db.getCollection( this.req.param.name ) )

            } else if ( this.req.param.action === 'token' ) {

                if( this.req.param.state === 'verify' )
                    this.prepareRequest( await token.tokenList.check( this.req.param.token ) )
                else if ( this.req.param.state === 'remove' )
                    token.tokenList.del( this.req.param.token )

            } else if ( this.req.param.action === 'login' ) {
                this.prepareRequest( await user.user.login( this.req.param ) )
            } else if ( this.req.param.action === 'register' ) {
                this.prepareRequest( await user.user.createUser( this.req.param ) )
            } else if ( this.req.param.action === 'updateUser' ) {
                if( await token.tokenList.check( this.req.param.token ) === true ){
                    const resp = await user.user.editUser( this.req.body )
                    resp.token = this.req.param.token
                    this.prepareRequest( resp )
                } else
                    this.prepareRequest( false )
            } else if ( this.req.param.action === 'updatePwd' ) {
                this.prepareRequest( await user.user.editPwd( this.req.param ) )
            } else if ( this.req.param.action === 'cart' ) {
                if( await token.tokenList.check( this.req.param.token ) === true ){
                    // TODO: Rewrite dbQuery
                    this.prepareRequest( await dbQuery.dbCart( config.db.userRW, config.db.pwdRW, config.db.name, 'users',this.req.param.action ,this.req.param.email , this.req.body ) )
                }
            } else if ( this.req.param.action === 'orders' ) {
                if( await token.tokenList.check( this.req.param.token ) === true ){
                    // TODO: Rewrite dbQuery
                    this.prepareRequest( await dbQuery.dbOrders( config.db.userRW, config.db.pwdRW, config.db.name, 'orders',this.req.param.action , this.req.param.email ) )
                } else {
                    this.prepareRequest( false )
                }
            }
        } else if ( path.extname( String( this.req.url ) ) === '' && String( this.req.url.pathname ) !== '/' ) {
            this.res.headers['Location'] = '/#' + String( this.req.url.pathname ).replace('/', '')
            this.res.headers[':status'] = 302
        }  else {
            await readFile
        }

    }

    /**
     * Prepare response
     * @method
     * @param {object} [resp]
     */
    prepareRequest( resp ){

        this.res.headers[ 'content-type' ] = 'application/json'
        this.res.data = JSON.stringify( resp )

    }

    /**
     * Read file
     * @method
     * @returns {Promise<void>}
     */
    async readFile( ) {
        await msgSys.send('read', 'debug' )
        this.fileName = this.req.path.join( path.sep )
        this.filePath = 'public/' + ( this.fileName === '' ? 'index.html' : this.fileName )
        this.ext = path.extname( this.filePath ).substring( 1 )
        //if (this.conf.typeAllowed instanceof Array && !this.conf.typeAllowed.includes(ext)) { throw new Error('403 Forbidden, file type not allowed') }
        this.res.headers[ 'content-type' ] = ( this.ext in this.mimeTypes ) ? this.mimeTypes[ this.ext ] : 'text/plain'
        try {
            this.res.data = await fs.promises.readFile( this.filePath )
        } catch ( error ) {
            if ( error.code === 'ENOENT' )
                throw new Error( '404 Not Found' )
            throw error
        }
    }
}

let frigg = new Server()
frigg.start()