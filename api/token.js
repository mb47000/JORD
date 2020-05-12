const msgSys        = require( './msgSystem.js' )

msgSys.send( 'Token Manage..............READY', 'success' )

let tokenUserList = [ ]

async function addUser(  ) {

    let randomstring = ( ) =>  Math.random().toString(36).substr(2)
    let token = randomstring() + randomstring() + randomstring()
    tokenUserList.push(token)

    return token

}


async function delUser( token ) {

    let tokenUser = tokenUserList.indexOf(token)
    if (tokenUser > -1) {
        tokenUserList.splice(tokenUser, 1);
    }

}

async function verifyUser( token ) {

    let resToken = tokenUserList.find( e => e === token) ? true : false
    return resToken


}

module.exports = {
    addUser,
    delUser,
    verifyUser,
}