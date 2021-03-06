const mongoClient   = require( 'mongodb' ).MongoClient
const msgSys        = require( './msgSystem.js' )
const config        = require( '../public/assets/config.json' )

/**
 * Manage mongoDB database
 * @class
 */
class Database {
    /**
     * Prepare mongoDB instance
     * @constructor
     * @param {string} [user] account username
     * @param {string} [pwd] account password
     * @param {string} [name] of database
     */
    constructor( user, pwd, name) {
        try {
            this.uri = `mongodb://${user}:${pwd}@127.0.0.1:27017/?authSource=${name}&readPreference=primary&appname=MongoDB%20Compass&ssl=false`
            this.name = name
            this.client = new mongoClient( this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } )
        } catch( error ) {
            msgSys.send( error, 'error' )
            return error
        }
    }

    /**
     * Connection to mongoDB
     * @method
     * @returns {Promise<void>} a MongoClient instance
     */
    async connection() {
        try {
            await this.client.connect()
            this.db = this.client.db( this.name )
        } catch( error ) {
            await msgSys.send( error, 'error' )
            return error
        }
    }

    /**
     * Close mongoDB connnection
     * @method
     * @returns {Promise<void>}
     */
    async closeConnect() {
        await this.client.close()
    }

    /**
     * Get all documents in targeted collection into Array [MongoDB]
     * @method
     * @param {string} [collection] targeted
     * @returns {Promise<Array>} Get all documents in collection
     */
    async getCollection( collection ) {
        try {
            this.collection = await this.db.collection( collection ).find( ).toArray( )
            await msgSys.send( `Open connection to Database "${ this.name }" and get "${ collection }"` )
            return this.collection
        } catch ( error ) {
            await msgSys.send( error, 'error' )
            return error
        }
    }

    /**
     * Add new document in specific collection [MongoDB]
     * @method
     * @param {string} [collection] targeted
     * @param {object} [primaryKey] ex: {key: value} to check if document already exist
     * @param {object} [fields] to create new document
     * @returns {Promise<string>} message for error or success
     */
    async createDocument( collection, primaryKey, fields ) {
        try {
            this.document = await this.db.collection( collection ).find( primaryKey ).limit(1).toArray()
            if ( this.document.length != 0 ) {
                return 'already existing document'
            } else {
                await this.db.collection( collection ).insertOne( fields, error => {
                    if ( error ) {
                        msgSys.send( error, 'error' )
                    }
                    msgSys.send( `Document ADD with success in ${collection}`, 'success' )
                })
                return 'create document'
            }
        } catch ( error ) {
            await msgSys.send( error, 'error' )
            return error
        }
    }

    /**
     * Edit one document in specific collection [MongoDB]
     * @method
     * @param {string} [collection] targeted
     * @param {object} [primaryKey] ex: {key: value} to find document
     * @param {object} [fields] to edit document
     * @returns {Promise<string>} message for error or success
     */
    async editDocument( collection, primaryKey, fields ) {
        try {
            await this.db.collection( collection ).findOneAndUpdate( primaryKey, {$set: fields} )
            await msgSys.send( `Document EDIT with success in ${collection}`, 'success' )
            return 'edit document'
        } catch ( error ) {
            await msgSys.send( error, 'error' )
            return error
        }
    }

    /**
     * Get document on specific collection [MongoDB]
     * @method
     * @param {string} [collection] targeted
     * @param {object} [primaryKey] ex: {key: value} to find document
     * @returns {Promise<Collection~findAndModifyWriteOpResultObject|Array>} document
     */
    async getDocument( collection, primaryKey ) {
        try {
            this.document = await this.db.collection( collection ).find( primaryKey ).limit(1).toArray()
            return this.document
        } catch( error ) {
            await msgSys.send( error, 'error' )
            return error
        }
    }
}

let db = new Database( config.db.userRW, config.db.pwdRW, config.db.name )
exports.db = db

msgSys.send( 'Database..............READY', 'success' )