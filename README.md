# JORD
Minimal website SPA system without framework

## Commands
* Launch server : `npm run server`
* Launch watch : `npm run watch`
* Launch compil : `npm run compil`

## Install
### Prerequisite
* NodeJS (v.12.16.2 and more)
* MongoDB server (4.2.5 and more)

### Dépendencies
* Argon2 ( password-hashing function )
* MongoDB ( MongoDB driver for Node.js )
* Nodemailer ( Allow easy as cake email sending )
* SASS ( CSS extension and preprocessor )
* Terser ( JavaScript parser and mangler/compressor )

### Other
* MiniCSS minimal, responsive, style-agnostic CSS framework (https://minicss.org/docs)
* Feather Icons set v.4.24.1 (https://feathericons.com/)

### Database

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

Create 3 collections :
* users
* products
* pages
* orders

```
use databaseName
db.createCollection('users')
db.createCollection('products')
db.createCollection('pages')
db.createCollection('orders')
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

## Add account
### Create user from db
```
use databaseName
db.users.insertOne(
   { 
   "password": "",
   "email": "",
   "firstname": "",
   "lastname": "",
   "address": "",
   "postalCode": "",
   "town": "",
   "shipping_address": "",
   "shipping_postalCode": "",
   "shipping_town": ""
   }
)
```
#### Fields imposed and never empty :
* Password (hash with argon2)
* Email

#### Fields imposed and can be empty :
* Firstname
* Lastname
* Address
* Postal Code
* Town
* Shipping Address
* Shipping Postal Code
* Shipping Town


## Add Content
### New pages
1. Go into folder /views/pages
2. Create HTML file
3. Add new document in "pages" collection

```
use databaseName
db.pages.insertOne(
   { 
   slug: "my-page-slug", 
   fileName: "myFileName", 
   title: "My page Title",
   access: "0" 
   }
)
```
* Slug : Link use to show page
* File Name : File Name in /views/pages (without .html)
* Title : Use for title tag
* Access : Access level (0: all | 1 : user login)

### New Product
Add document in collection "products", the field "slug" is required.

```
use databaseName
db.products.insertOne(
   { 
   slug: "my-product-slug", 
   access: "0",
   name: "Product Name, 
   price: "89.98",
   }
)
```
* Slug : Link use to show product page
* Access : Access level (0: all | 1 : user login)
* Name : Use for H1 and Title tag
* Price : The product price

### New Order
Add document in collection "orders".

```
use databaseName
db.orders.insertOne(
   { 
   status: "inprogress",
   cart: Array[], 
   infos: Array[],
   dateCreate: "01-01-2020-10:30",
   datePurchase: "01-01-2020-10:35",
   }
)
```
* Status : The status of the order
* Cart : An array with the cart
* Infos : An array with user informations (address, firstname, lastname, email, id)
* dateCreate : Date when the document was create
* datePurchase : Date when payment was proceed

## Edit Templates and Parts
### Parts
Pages element's like header, footer... into folder /views/parts/

### Templates
Use for same "type" of pages, like products, blog... into folder /views/parts/


## Use Feather Icon set
List of icons (v4.24.1) : https://feathericons.com/
Github docs : https://github.com/feathericons/feather#feather
```
<svg class="feather">
  <use xlink:href="/src/svg/feather-sprite.svg#iconName"/>
</svg>
```
