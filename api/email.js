const nodemailer = require( 'nodemailer' )

console.log( 'Send Email API Load' )

function send( data ) {

    console.log( 'Create transporter' )
    const transporter = nodemailer.createTransport( {
        host: "ssl0.ovh.net",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: "a.leclercq@coprometal.com",
            pass: "aeB8iW4Ya"
        }
    } )

    console.log( 'Generate email' )
    let message = {
        from: "ne-pas-repondre@coprometal.com",
        to: data.email,
        subject: data.subject,
        text: ( { path: `./views/email/${data.textFile}.txt` } ),
        html: ( { path: `./views/email/${data.textFile}.html` } )
    }

    console.log( 'Sending Email' )

    transporter.sendMail(message, function( err, res ) {
        if ( err ) {
            console.error( 'there was an error: ', err );
        } else {
            console.log( 'here is the res: ', res )
        }
    } )

}

module.exports = {
    send
}