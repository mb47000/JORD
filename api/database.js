const mongoClient   = require( 'mongodb' ).MongoClient
const argon2        = require( 'argon2' )
const email         = require( './email.js' )
const token         = require( './token.js' )
const dateTime      = require( './dateTime.js' )

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
        await client.connect( )
        console.log( 'Connected successfully to mongodb server' )
        const db = client.db( dbName )
        const collection = await db.collection( dbCollection.name ).find( ).toArray( )
        console.log( `Get ${ dbCollection.name } in ${ dbName }` )

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
        const document = await db.collection( dbCollection ).find( { email: dbElem.email } ).toArray()

        if ( document.length != 0 ){
            try {
                if ( await argon2.verify( document[0].password, dbElem.password ) ) {

                    let userData = token.addUser(  )
                        .then(e => {
                            let data = {
                                'email': document[0].email,
                                'firstname': document[0].firstname,
                                'lastname': document[0].lastname,
                                'address': document[0].address,
                                'postalCode': document[0].postalCode,
                                'town': document[0].town,
                                'shipping_address': document[0].shipping_address,
                                'shipping_postalCode': document[0].shipping_postalCode,
                                'shipping_town': document[0].shipping_town,
                                'token': e
                            }
                            return data
                        })
                    return userData

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

    try {
        await client.connect(  )
        console.log( 'Connected successfully to mongodb server' )

        const db = client.db( dbName )
        let document = await db.collection( dbCollection ).find( { email: dbElem.email } ).toArray()

        console.log(`Get ${dbCollection} in ${dbName}`)

        if ( document.length != 0 ){

            return 'email already use'

        } else {

            let sendData = {}
            let passwordHash = await argon2.hash( dbElem.password )
            sendData['password'] = passwordHash
            sendData['email'] = dbElem.email
            sendData['firstname'] = ''
            sendData['lastname'] = ''
            sendData['address'] = ''
            sendData['postalCode'] = ''
            sendData['town'] = ''
            sendData['shipping_address'] = ''
            sendData['shipping_postalCode'] = ''
            sendData['shipping_town'] = ''

            db.collection( dbCollection ).insertOne( sendData, ( err, res ) => {
                if ( err ) {
                    console.error(err)
                }
                console.log( `${dbElem.username} add to users` )
            })

            email.send( {
                email: dbElem.email,
                subject: 'Votre inscription sur notre site',
                textFile: 'confirmRegister',
            } )

            return 'register ok'

        }

    } catch ( e ) {
        console.error( e )
    } finally {
        await client.close()
        console.log( 'Disconnected successfully to mongodb server' )
    }

}

async function dbUpdateUser( dbUser, dbPwd, dbName, dbCollection, dbElem ){

    dbConnect( dbUser, dbPwd, dbName )

    try {
        await client.connect(  )
        console.log( 'Connected successfully to mongodb server' )

        const db = client.db( dbName )
        let dataUser = {
            'email': dbElem.email,
            'firstname': dbElem.firstname,
            'lastname': dbElem.lastname,
            'address': dbElem.address,
            'postalCode': dbElem.postalCode,
            'town': dbElem.town,
            'shipping_address': dbElem.shipping_address,
            'shipping_postalCode': dbElem.shipping_postalCode,
            'shipping_town': dbElem.shipping_town,
        }
        let document = await db.collection( dbCollection ).findOneAndUpdate(
        { email: dbElem.email },
        { $set: dataUser }
        )
        return dataUser
        console.log(`Get ${dbCollection} in ${dbName}`)
    } catch ( e ) {
        console.error( e )
    } finally {
        await client.close()
        console.log( 'Disconnected successfully to mongodb server' )
    }

}

async function dbUpdatePassword ( dbUser, dbPwd, dbName, dbCollection, dbElem ) {

    dbConnect( dbUser, dbPwd, dbName )

    try {
        await client.connect();
        console.log( 'Connected successfully to mongodb server' )
        const db = client.db( dbName )
        const document = await db.collection( dbCollection ).find( { email: dbElem.email } ).toArray()

        if ( document.length != 0 ){
            try {
                if ( await argon2.verify( document[0].password, dbElem.password ) ) {

                    let passwordHash = await argon2.hash( dbElem.newPassword )
                    let updateDocument = await db.collection( dbCollection ).findOneAndUpdate(
                        { email: dbElem.email },
                        { $set: { 'password': passwordHash } }
                    )
                    return 'password updated'

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

async function dbCart( dbUser, dbPwd, dbName, dbCollection, action, userEmail, dbElem ){

    dbConnect( dbUser, dbPwd, dbName )

    try {
        await client.connect(  )
        console.log( 'Connected successfully to mongodb server' )

        const db = client.db( dbName )
        if( action === 'saveCart' ){

            let data = JSON.parse( dbElem )
            data = JSON.parse(data[0])

            let dataCart = {
                'cart': data,
            }
            let document = await db.collection( dbCollection ).findOneAndUpdate(
                { email: userEmail },
                { $set: dataCart }
            )

        } else if( action === 'getCart' ){

            let document = await db.collection( dbCollection ).find( { email: userEmail } ).toArray( )
            if( document[0].cart != 'null' ) {
                return JSON.stringify( document[0].cart )
            } else {
                return 'cart empty'
            }
        }

        // return dataUser
        console.log(`Get ${dbCollection} in ${dbName}`)
    } catch ( e ) {
        console.error( e )
    } finally {
        await client.close()
        console.log( 'Disconnected successfully to mongodb server' )
    }

}

async function dbOrders( dbUser, dbPwd, dbName, dbCollection, action, dbElem ) {

    dbConnect( dbUser, dbPwd, dbName )

    console.log( dbElem )

    try {
        await client.connect(  )
        console.log( 'Connected successfully to mongodb server' )

        const db = client.db( dbName )
        if( action === 'createOrders' ){

            let userInfo = await db.collection( 'users' ).find( { email: dbElem } ).toArray( )

            let status = 'inProgress'
            let cart = userInfo[0].cart
            let infos = { }
            for ( let [ k, v ] of Object.entries( userInfo[0] ) )
                k != 'password' && k != 'cart' ? infos[k] = v : null

            let dateCreate = await dateTime.get( )
            let order = {
                'status': status,
                'cart': cart,
                'infos': infos,
                'dateCreate': dateCreate,
                'datePurchase': ''
            }
            let document = await db.collection( dbCollection ).insertOne( order, ( err, res ) => {
                if ( err ) {
                    console.error( err )
                }
                console.log( `New order` )
            } )

            email.send( {
                email: dbElem,
                subject: 'Votre commande sur notre site',
                textFile: 'orderInProgress',
            } )

            return 'order created'


        } else if( action === 'editOrders' ){


        }

        console.log(`Get ${dbCollection} in ${dbName}`)
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
    dbRegister,
    dbUpdateUser,
    dbUpdatePassword,
    dbCart,
    dbOrders,
}