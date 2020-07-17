// Find colors in https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
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
        case 'debug':
            style = '\x1b[46;30m'
            break
        default:
            style = '\x1b[0m'
    }

    type = type === undefined ? '' : `[${ type }]`

    await console.log( style, `[${ await dateTime.get( ) }]${ type } ${ msg }`, '\x1b[0m' )

}

module.exports = {
    send,
}