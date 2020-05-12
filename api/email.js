const nodemailer    = require( 'nodemailer' )
const msgSys        = require( './msgSystem.js' )
msgSys.send('------------------------------------' )
msgSys.send('---------- SERVER STARTUP ----------' )
msgSys.send('------------------------------------' )
msgSys.send( 'Sending Email..............READY', 'success' )

function send( data ) {
    msgSys.send( 'EMAIL: Create transporter' )
    const transporter = nodemailer.createTransport( {
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "9304b0fd880a2d",
            pass: "928ca8573fb3c5"
        }
    } )

    msgSys.send( 'EMAIL: Generate email' )
    let message = {
        from: "ne-pas-repondre@jord.com",
        to: data.email,
        subject: data.subject,
        text: ( { path: `./views/email/${data.textFile}.txt` } ),
        html: ( { path: `./views/email/${data.textFile}.html` } )
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