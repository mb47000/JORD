# JORD
Minimal website SPA system without framework

# Commands
* Launch server : `npm run server`
* Launch watch : `npm run watch`
* Launch compil : `npm run compil`

# Install
**Prerequisite**
* NodeJS (v.12.16.2 and more)
* MongoDB server (4.2.5 and more)

**Dépendencies**
* Argon2 ( password-hashing function )
* MongoDB ( MongoDB driver for Node.js )
* Nodemailer ( Allow easy as cake email sending )
* SASS ( CSS extension and preprocessor )
* Terser ( JavaScript parser and mangler/compressor )

**Other**
* Feather Icons set v.4.24.1 (https://feathericons.com/)

**Database**

Create mongoDB database with 2 users, one for read and one for readWrite.

```
use databaseName
db.createUser(
  {
    user: "dbNameRead",
    pwd: useVeryStrongPassword,
    roles: [
       { role: "read", db: "databaseName" }
    ]
  }
)
```

```
use databaseName
db.createUser(
  {
    user: "dbNameReadWrite",
    pwd: useVeryStrongPassword,
    roles: [
       { role: "readWrite", db: "databaseName" }
    ]
  }
)
```

Create 2 collections :
* users
* products

```
use databaseName
db.createCollection('users')
db.createCollection('products')
```

Add users info in *server.js* file, edit the "dbInfo" object.

```
const dbInfo = {
    dbName: 'databaseName',
    userR: 'userRead',
    pwdR: 'passwordUserRead',
    userRW: 'userReadWrite',
    pwdRW: 'passwordReadWrite'
}
```

# Add Content
**New pages**
1. Go into folder /views/pages
2. Create HTML file
3. Go into file /src/js/router.js
4. Add element into "pagesList" object like this

```
let pagesList = {
    '#': 'home',
    '#404': '404',
    '#slug': 'htmlfilename'
}
```
The key is the slug use to create the http address and the value is the HTML file in /views/pages (don't write extension ".html").

**New Product**
Add document in collection "products", the field "slug" is required.

```
use databaseName
db.products.insertOne(
   { 
   slug: "my-product-slug", 
   name: "Product Name, 
   price: "89.98",
   }
)
```

# Edit Templates and Parts
**Parts**
Pages element's like header, footer... into folder /views/parts/

**Templates**
Use for same "type" of pages, like products, blog... into folder /views/parts/


# Use Feather Icon set
List of icons (v4.24.1) : https://feathericons.com/
Github docs : https://github.com/feathericons/feather#feather
```
<svg class="feather">
  <use xlink:href="/src/svg/feather-sprite.svg#iconName"/>
</svg>
```
