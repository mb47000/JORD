let tokenUserList = [ ]

async function addUser(  ) {

    let randomstring = ( ) =>  Math.random().toString(36).substr(2)
    let token = randomstring() + randomstring() + randomstring()
    tokenUserList.push(token)
    console.log( tokenUserList )
    return token


}


async function delUser( token ) {

    let tokenUser = tokenUserList.indexOf(token)
    if (tokenUser > -1) {
        tokenUserList.splice(tokenUser, 1);
    }
    console.log( tokenUserList )

}

async function verifyUser( token ) {

    let resToken = tokenUserList.find( e => e === token) ? true : false
    console.log( tokenUserList )
    return resToken


}

module.exports = {
    addUser,
    delUser,
    verifyUser,
}