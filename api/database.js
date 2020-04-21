const mongoClient = require('mongodb').MongoClient
const argon2 = require('argon2')
let client

function dbConnect ( dbUser, dbPwd, dbName ) {

    const uri = `mongodb://${dbUser}:${dbPwd}@127.0.0.1:27017/?authSource=${dbName}&readPreference=primary&appname=MongoDB%20Compass&ssl=false`

    client = new mongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

}

async function dbLoad ( dbUser, dbPwd, dbName, dbCollection ) {

   dbConnect( dbUser, dbPwd, dbName )

    try {
        await client.connect()
        console.log( 'Connected successfully to mongodb server' )
        const db = client.db( dbName )
        const collection = await db.collection( dbCollection ).find().toArray()
        console.log(`Get ${dbCollection} in ${dbName}`)

        return collection

    } catch (e) {
        console.error( e )
    } finally {
        await client.close()
        console.log( 'Disconnected successfully to mongodb server' )
    }

}

async function dbLogin ( dbUser, dbPwd, dbName, dbCollection, dbElem ) {

    dbConnect( dbUser, dbPwd, dbName )

    try {
        await client.connect();
        console.log( 'Connected successfully to mongodb server' )
        const db = client.db( dbName )
        const document = await db.collection( dbCollection ).find( { username: dbElem.username } ).toArray()

        if ( document.length != 0 ){
            try {
                if ( await argon2.verify( document[0].password, dbElem.password ) ) {
                    let userInfo = []
                    userInfo.push(document[0].username, document[0].email)
                    return userInfo
                } else {
                    return 'incorrect password'
                }
            } catch ( err ) {
                console.log( err )
            }
        } else {
            return 'user not found'
        }
        console.log(`Get ${dbCollection} in ${dbName}`)

    } catch ( e ) {
        console.error( e );
    } finally {
        await client.close();
        console.log( 'Disconnected successfully to mongodb server' )
    }

}

async function dbRegister ( dbUser, dbPwd, dbName, dbCollection, dbElem ) {

    dbConnect( dbUser, dbPwd, dbName )

    console.log(dbElem)

    try {
        await client.connect()
        console.log( 'Connected successfully to mongodb server' )

        const db = client.db( dbName )
        let document = await db.collection( dbCollection ).find( { username: dbElem.username } ).toArray()

        console.log(`Get ${dbCollection} in ${dbName}`)

        if ( document.length != 0 ){

            return 'username already exist'

        } else {

            document = await db.collection( dbCollection ).find( { email: dbElem.email } ).toArray()

            if ( document.length != 0 ){

                return 'email already use'

            } else {

                let sendData = {}
                let passwordHash = await argon2.hash( dbElem.password )
                sendData['username'] = dbElem.username
                sendData['password'] = passwordHash
                sendData['email'] = dbElem.email

                db.collection( dbCollection ).insertOne( sendData, ( err, res ) => {
                    if ( err ) {
                        console.error(err)
                    }
                    console.log( `${dbElem.username} add to users` )
                })

                return 'register ok'
            }
        }

    } catch ( e ) {
        console.error( e )
    } finally {
        await client.close()
        console.log( 'Disconnected successfully to mongodb server' )
    }

}

module.exports = {
    dbLoad,
    dbLogin,
    dbRegister
}