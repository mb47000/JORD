const nodemailer    = require( 'nodemailer' )
const msgSys        = require( './msgSystem.js' )
const config         = require( '../jordConfig.json' )

msgSys.send('------------------------------------' )
msgSys.send('---------- SERVER STARTUP ----------' )
msgSys.send('------------------------------------' )
msgSys.send( 'Sending Email..............READY', 'success' )

function send( data ) {
    msgSys.send( 'EMAIL: Create transporter' )
    const transporter = nodemailer.createTransport( {
        host: config.mail.host,
        port: config.mail.port,
        auth: {
            user: config.mail.user,
            pass: config.mail.pass
        }
    } )

    msgSys.send( 'EMAIL: Generate email' )
    let message = {
        from: "ne-pas-repondre@jord.com",
        to: data.email,
        subject: data.subject,
        text: ( { path: `./assets/views/email/${ data.textFile }.txt` } ),
        html: ( { path: `./assets/views/email/${ data.textFile }.html` } )
    }

    transporter.sendMail(message, function( err, res ) {
        if ( err ) {
            msgSys.send( err, 'error' )
        } else {
            msgSys.send( 'EMAIL: Email SEND', 'success' )
            msgSys.send( `EMAIL: Response >> ${ res.response }`)
            msgSys.send( `EMAIL: MessageID >> ${ res.messageId }` )
        }
    } )

}

module.exports = {
    send
}