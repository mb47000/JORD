const nodemailer = require( 'nodemailer' )

console.log( 'Send Email API Load' )

function send( data ) {

    console.log( 'Create transporter' )
    const transporter = nodemailer.createTransport( {
        host: "in-v3.mailjet.com",
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: "611c3a2c35eb931d71055c8fa8846c46",
            pass: "dd6e18ed9a3a53d5136427a71a89f433"
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