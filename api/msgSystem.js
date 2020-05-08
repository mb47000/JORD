const dateTime = require( './dateTime.js' )

async function send( msg, type ) {

    let style
    switch ( type ) {
        case 'success':
            style = '\x1b[32m'
            break
        case 'error':
            style = '\x1b[31m'
            break
        case 'warning':
            style = '\x1b[33m'
            break
        case 'info':
            style = '\x1b[34m'
            break
        default:
            style = '\x1b[30m'
    }

    type = type === undefined ? '' : `[${ type }]`

    console.log(style, `[${ await dateTime.get() }]${ type } ${ msg }`)

}

module.exports = {
    send,
}

send('------------------------------------' )
send('---------- SERVER STARTUP ----------' )
send('------------------------------------' )
