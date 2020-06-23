const msgSys        = require( './msgSystem.js' )
const db            = require( './database.js' )
const argon2        = require( 'argon2' )
const token         = require( './token.js' )

/**
 * Manage User
 * @class
 */
class User {
    /**
     * Create new user
     * @method
     * @param {object} [data] to insert into database
     * @returns {Promise<object>} created data
     */
    async createUser( data ) {
        try {
            await db.db.connection()
            data.password = await argon2.hash( data.password )
            await db.db.createDocument('users', { email: data.email }, data )
        } catch ( error ) {
            await msgSys.send( error, 'error' )
            return error
        } finally {
            await db.db.closeConnect()
        }
    }

    /**
     * Edit user infos
     * @method
     * @param {object} [data] to edit into database
     * @param {string} [tokenUser] security check
     * @returns {Promise<object>} edited data
     */
    async editUser( data, tokenUser ) {
        try {
            await db.db.connection()
            await token.tokenList.check( tokenUser )
                ? await db.db.editDocument( 'users', { email: data.email }, data )
                : 'token invalid'
        } catch ( error ) {
            await msgSys.send( error, 'error' )
            return error
        } finally {
            await db.db.closeConnect()
        }
    }

    /**
     * Edit & hash password
     * @method
     * @param {object} [data] email, old and new password
     * @param {string} [tokenUser] security check
     * @returns {Promise<string|*>} success or error message
     */
    async editPwd( data, tokenUser ) {
        try {
            await db.db.connection()
            if( await token.tokenList.check( tokenUser ) ) {
                this.document = await db.db.getDocument( 'users', { email: data.email } )
                await argon2.verify( this.document[0].password, data.oldPassword )
                    ? await db.db.editDocument( 'users', { email: data.email }, { password: await argon2.hash( data.newPassword ) } )
                    : 'old password invalid'
            } else {
                return 'token invalid'
            }
        } catch ( error ) {
            await msgSys.send( error, 'error' )
            return error
        } finally {
            await db.db.closeConnect()
        }
    }

    /**
     * Login user and return token auth
     * @method
     * @param {object} [data] email & password
     * @returns {Promise<string|*>} token or error message
     */
    async login( data ) {
        try {
            await db.db.connection()
            this.document = await db.db.getDocument( 'users', { email: data.email } )
            if( await argon2.verify( this.document[0].password, data.password ) ) {
                this.token = token.tokenList.add()
                return this.token
            } else {
                return 'password incorrect'
            }
        } catch ( error ) {
            await msgSys.send( error, 'error' )
            return error
        } finally {
            await db.db.closeConnect()
        }
    }


}

let user = new User()
exports.user = user