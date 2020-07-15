const nodeMailer    = require( 'nodemailer' )
const msgSys        = require( './msgSystem.js' )
const config        = require( '../public/assets/config.json' )

/**
 * Manage email sending
 * @class
 */
class Email {

    constructor() {
        this.transporter = nodeMailer.createTransport( {
            host: config.mail.host,
            port: config.mail.port,
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        } )
    }

    /**
     * Sending email
     * @method
     * @param {object} [data] to create and send email
     * @returns {Promise<void>}
     */
    async send( data ){
        await msgSys.send( 'EMAIL: Generate email' )
        this.message = {
            from: "ne-pas-repondre@jord.com",
            to: data.email,
            subject: data.subject,
            text: ( { path: `./assets/views/email/${ data.textFile }.txt` } ),
            html: ( { path: `./assets/views/email/${ data.textFile }.html` } )
        }

        await this.transporter.sendMail( this.message, function( err, res ) {
            if ( err ) {
                msgSys.send( err, 'error' )
            } else {
                msgSys.send( 'EMAIL: Email SEND', 'success' )
                msgSys.send( `EMAIL: Response >> ${ res.response }`)
                msgSys.send( `EMAIL: MessageID >> ${ res.messageId }` )
            }
        } )

    }
}

let email = new Email()

exports.email = email

msgSys.send('------------------------------------' )
msgSys.send('---------- SERVER STARTUP ----------' )
msgSys.send('------------------------------------' )
msgSys.send('Sending Email..............READY', 'success' )