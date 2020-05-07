const nodemailer = require( 'nodemailer' )

console.log( 'Send Email API Load' )

function send( data ) {

    console.log( 'Create transporter' )
    const transporter = nodemailer.createTransport( {
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "9304b0fd880a2d",
            pass: "928ca8573fb3c5"
        }
    } )

    console.log( 'Generate email' )
    let message = {
        from: "ne-pas-repondre@jord.com",
        to: data.email,
        subject: data.subject,
        text: ( { path: `./views/email/${data.textFile}.txt` } ),
        html: ( { path: `./views/email/${data.textFile}.html` } )
    }

    console.log( message )

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