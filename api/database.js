const mongoClient = require('mongodb').MongoClient
const argon2 = require('argon2')
let client

function dbConnect(dbUser, dbPwd, dbName){
    const uri = `mongodb://${dbUser}:${dbPwd}@127.0.0.1:27017/?authSource=${dbName}&readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
    client = new mongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

async function dbLoad(dbUser, dbPwd, dbName, dbCollection) {

   dbConnect(dbUser, dbPwd, dbName)

    try {
        await client.connect();
        console.log("Connected successfully to mongodb server");
        const db = client.db(dbName);
        const collection = await db.collection(dbCollection).find().toArray()
        console.log(`Get ${dbCollection} in ${dbName}`)
        return collection
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log('Disconnected successfully to mongodb server')
    }

}

async function dbLogin(dbUser, dbPwd, dbName, dbCollection, dbElem) {

    dbConnect(dbUser, dbPwd, dbName)

    try {
        await client.connect();
        console.log("Connected successfully to mongodb server");
        const db = client.db(dbName);
        const document = await db.collection(dbCollection).find({ username: dbElem.username}).toArray()
        if ( document.length != 0 ){
            try {
                if (await argon2.verify(document[0].password, dbElem.password)) {
                    return document
                } else {
                    return 'incorrect password'
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            return 'user not found'
        }
        console.log(`Get ${dbCollection} in ${dbName}`)

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log('Disconnected successfully to mongodb server')
    }

}

module.exports = {
    dbLoad,
    dbLogin
}