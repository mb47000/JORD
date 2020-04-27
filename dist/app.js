let dbReady = new CustomEvent( 'dbReady', { bubbles: true } )
let pageReady = new CustomEvent( 'pageReady', { bubbles: true } )
let initWebsite = new CustomEvent( 'initWebsite', { bubbles: true } )
let pagesList = {
    '#': 'home',
    '#404': '404',
    '#about-me': 'about',
    '#mon-compte': 'useraccount'
    '#mon-panier': 'cart'
}

class Router {

    constructor( routes ) {

        this.routes = routes
        this.cache = {}

        window.addEventListener( 'hashchange', this.loadPage.bind( this ) )
        document.addEventListener( 'dbReady', this.loadPage.bind( this ) )
    }

    async loadPage( e ){

        let route = location.hash || '#'

        if( !this.routes.hasOwnProperty( route ) )
            route = '#404'

        history.pushState( '', '', route.replace( '#', '/' ) )

        if( !this.cache.hasOwnProperty( route ) ) {

            let res = await fetch( this.routes[route] )
            this.cache[route] = await res.text()

        }

        document.getElementById( 'content' ).innerHTML = this.cache[route]

        document.dispatchEvent( pageReady )

    }
}

let routes = {}

function createRoutesObject( rootFolder, routeList ){
    for ( let [ key, value ] of Object.entries( routeList ) ) {
        routeList[key] = rootFolder + value + '.html'
    }
    Object.assign( routes, routeList )
}

createRoutesObject( '../views/pages/', pagesList )

let pagesRoutes = new Router( routes );
(() => { fetch( '/api/productsList' )

    .then( res => { return res.json() } )

    .then( data => {

        localStorage.setItem( 'products', JSON.stringify( data ) )
        let productRoutes = {}

        data.forEach( e => {
            productRoutes['#' + e.slug] = 'product'
        })

        createRoutesObject( '../views/templates/', productRoutes )
        document.dispatchEvent( dbReady )
    })

})()

window.addEventListener( 'pageReady', e => buildProduct() )

function buildProduct(){

    let target = location.pathname.split( '/' ).pop()
    let productList = localStorage.getItem( 'products' )

    JSON.parse( productList ).forEach( elt => {

        if( elt.slug === target ){
            console.log( elt )
            document.querySelector( 'h1' ).innerHTML = elt.name
            document.getElementById( 'ref' ).innerHTML = elt.ref
            document.getElementById( 'price' ).innerHTML = elt.price
        }

    })

    document.dispatchEvent( initWebsite )
}

let cartLocal

document.addEventListener( 'initWebsite', ( ) => {

    document.getElementById( 'addCart' ) ? document.getElementById( 'addCart' ).addEventListener( 'click', e => addCart( e.target ) ) : null

    document.getElementById( 'cartModal' ).innerHTML = cartHTML

    refreshCart( )

})

document.body.addEventListener( 'click', e => {

    e.target.closest('.removeCart') ? removeCart(e.target.closest('.removeCart').parentElement.parentElement.querySelector( '.refLabel > .value' ).innerHTML): null

})


function refreshCart( ) {

    cartLocal = localStorage.getItem( 'cartLocal' ) ? localStorage.getItem( 'cartLocal' ) : null

    const buttonCart = document.getElementById( 'buttonCart' )
    const tbody = document.getElementById( 'cart' ).getElementsByTagName( 'tbody' )[0]
    tbody.innerHTML = ''
    let totalPrice = 0

    if ( cartLocal ) {

        buttonCart.classList.remove( 'tooltip' )
        buttonCart.classList.add( 'buttonModal' )

        JSON.parse( cartLocal ).forEach( e => {
            tbody.innerHTML += cartRowHTML
            tbody.lastElementChild.querySelector( '.refLabel > .value' ).innerHTML = e.ref
            tbody.lastElementChild.querySelector( '.productLabel > .value' ).innerHTML = e.name
            tbody.lastElementChild.querySelector( '.priceLabel > .value' ).innerHTML = e.price
            tbody.lastElementChild.querySelector( '.qtyLabel > .value' ).innerHTML = e.qty
            tbody.lastElementChild.querySelector( '.totalLabel > .value' ).innerHTML = e.price * e.qty
            totalPrice += e.price * e.qty
        })

        tbody.nextElementSibling.lastElementChild.querySelector( '.value' ).innerHTML = totalPrice


    } else {

        buttonCart.classList.add( 'tooltip' )
        buttonCart.classList.remove( 'buttonModal' )

    }

}

function addCart( e ) {

    const productElem = e.closest( '.productElem' )
    let productAdd = { }
    let data = [ ]

    productAdd = {
            "ref"   : productElem.children[ 'ref' ].innerHTML,
            "name"  : productElem.children[ 'name' ].innerHTML,
            "price" : parseFloat( productElem.children[ 'price' ].innerHTML ),
            "qty"   : parseFloat( productElem.children[ 'qty' ].children[ 'qtyInput' ].value )
        }


    if ( !cartLocal ){

        data.push( productAdd )
        localStorage.setItem( 'cartLocal', JSON.stringify( data ) )
        refreshCart( )

    } else {

        data = JSON.parse( localStorage.getItem( 'cartLocal' ) )
        let newItem = true

        data.forEach( e => productAdd.ref === e.ref ? ( e.qty += productAdd.qty, newItem = false ) : null )
        newItem ? ( data.push( productAdd ), localStorage.setItem( 'cartLocal', JSON.stringify( data ) ) ) : localStorage.setItem( 'cartLocal', JSON.stringify( data ) )
        refreshCart( )

    }

}

function removeCart( ref ) {

    console.log( ref )
    let newData = []
    JSON.parse(cartLocal).forEach(e => {
        e.ref === ref ? null : newData.push( e )
    })
    console.log(newData)
    newData.length <= 0 ? ( localStorage.removeItem( 'cartLocal' ), refreshCart( ) ) : ( localStorage.setItem( 'cartLocal', JSON.stringify( newData ) ), refreshCart( ) )


}
let userMenuHTML,
    loginLogoutFormHTML,
    cartHTML,
    cartRowHTML

fetch( '../views/parts/navbar.html', { mode: 'no-cors' } )
    .then( response => response.text( ) )
    .then( data => document.getElementById( 'navbar' ).innerHTML = data )
    .catch( error => console.error( error ) )

fetch( '../views/parts/footer.html', { mode: 'no-cors' } )
    .then( response => response.text( ) )
    .then( data => document.getElementById( 'footer' ).innerHTML = data )
    .catch( error => console.error( error ) )

fetch( '../views/parts/pushNotification.html', { mode: 'no-cors' } )
    .then( response => response.text( ) )
    .then( data => document.getElementById( 'pushNotification' ).innerHTML = data )
    .catch( error => console.error( error ) )

fetch( '../views/parts/userMenu.html', { mode: 'no-cors' } )
    .then( response => response.text( ) )
    .then( data => userMenuHTML = data )
    .catch( error => console.error( error ) )

fetch( '../views/parts/loginLogoutForm.html', { mode: 'no-cors' } )
    .then( response => response.text( ) )
    .then( data => loginLogoutFormHTML = data )
    .catch( error => console.error( error ) )

fetch( '../views/parts/cart.html', { mode: 'no-cors' } )
    .then( response => response.text( ) )
    .then( data => cartHTML = data )
    .catch( error => console.error( error ) )

fetch( '../views/parts/cartRow.html', { mode: 'no-cors' } )
    .then( response => response.text( ) )
    .then( data => cartRowHTML = data )
    .catch( error => console.error( error ) )

document.addEventListener( 'initWebsite', function( ) {
    const pushNotif = document.getElementById( 'pushNotification' )
    const notice = pushNotif.firstElementChild
    const clodeBtn = notice.lastElementChild

    clodeBtn.addEventListener( 'click', e => {
        notice.classList.toggle( 'show' )
        notice.classList.toggle( 'hide' )
    })

})

function showPushNotification( type, msg ){

    const pushNotif = document.getElementById( 'pushNotification' )
    const notice = pushNotif.firstElementChild

    notice.classList.remove( 'show' )
    notice.classList.add( 'hide' )
    notice.classList.remove( 'info' )
    notice.classList.remove( 'success' )
    notice.classList.remove( 'error' )

    switch ( type ) {
        case 'success':
            notice.classList.add( 'success' )
            break
        case 'error':
            notice.classList.add( 'error' )
            break
        case 'info':
            notice.classList.add( 'info' )
            break
    }

    notice.querySelector( '.msg' ).innerText = ''
    notice.querySelector( '.msg' ).innerText = msg

    notice.classList.toggle( 'hide' )
    notice.classList.toggle( 'show' )

    setTimeout( function( ) {
        if ( notice.classList.contains( 'show' ) ) {
            notice.classList.toggle( 'show' )
            notice.classList.toggle( 'hide' )
        }
    }, 5000 )

}
document.body.addEventListener( 'click', e => {
    e.target.dataset.modaltarget != null ? showModal( e.target.dataset.modaltarget ) : e.target.closest( '.modal' ) === null ? hideModal() : null
})

function showModal( e ){
    document.querySelectorAll( `[data-modal]` ).forEach( elt => elt.hidden = true )
    document.querySelector( `[data-modal=${e}]` ).hidden = false
}

function hideModal(){
    document.querySelectorAll( `[data-modal]` ).forEach( elt => elt.hidden = true )
}
let userLocal = localStorage.getItem( 'userLocal' )

document.addEventListener( 'initWebsite', function() {

    if ( userLocal ) {

        userIsLog( )

    } else {

        document.getElementById( 'loginRegister' ).innerHTML = loginLogoutFormHTML

        const loginForm = document.getElementById( 'loginRegisterForm' )
        const switchForm = document.getElementById( 'switchForm' )
        const buttonSubmit = document.getElementById( 'buttonSend' )

        switchForm.addEventListener( 'click', ( e ) => {
            e.preventDefault( )

            buttonSubmit.classList.contains( 'loginSubmit' ) ? switchToRegister( ) : switchToLogin( )

            function switchToLogin( ) {
                switchForm.innerHTML = "Pas encore enregistré"
                loginForm.querySelector( 'legend' ).innerHTML = "S'identifier"
                loginForm.confirmPassword.hidden = true
                buttonSubmit.value = "Connexion"
                buttonSubmit.classList.toggle( 'loginSubmit' )
            }

            function switchToRegister( ) {
                switchForm.innerHTML = "J'ai déjà un compte"
                loginForm.querySelector( 'legend' ).innerHTML = "S'enregistrer"
                loginForm.confirmPassword.hidden = false
                buttonSubmit.value = "Inscription"
                buttonSubmit.classList.toggle( 'loginSubmit' )
            }
        })

        if ( loginForm ){

            loginForm.addEventListener( 'submit', async( e ) => {

                e.preventDefault( )
                let param = '?'

                if( e.target.monprenom.value === '' & e.target.monadresse.value === 'ceci est mon adresse' ) {
                    let data = new FormData(e.target)

                    if ( buttonSubmit.classList.contains( 'loginSubmit' ) ) {
                        for ( var [key, value] of data.entries( ) ) {
                            param = param.concat( `${key}=${value}&` )
                        }

                        param = param.slice( 0, -1 )

                        fetch( `/api/login${param}` )
                            .then( res => {
                                return res.json( )
                            })
                            .then( data => {
                                if ( data === 'user not found' ) {
                                    showPushNotification( 'error', "Email incorrect" )
                                } else if ( data === 'incorrect password' ) {
                                    showPushNotification( 'error', "Mauvais mot de passe" )
                                } else {
                                    localStorage.setItem( 'userLocal', data )
                                    showPushNotification( 'success', "Connexion réussi !" )
                                    hideModal( )
                                    userIsLog( )
                                }
                            })
                    } else {

                        let dataSend = { }

                        for ( var [key, value] of data.entries( ) ) {
                            dataSend[key] = value
                            param = param.concat( `${key}=${value}&` )
                        }

                        const regexPatPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+\-=]*.{8,25}$/
                        const pwdCheck = regexPatPwd.test( dataSend.password )
                        pwdCheck ? null : showPushNotification( 'error', "Le mot de passe doit contenir 8 à 25 caractères et au moins 1 majuscule, 1 minuscule et 1 chiffre." )

                        if ( pwdCheck && dataSend.password === dataSend.confirmPassword ){
                            param = param.slice( 0, -1 )

                            fetch( `/api/register${param}` )
                                .then( res => {
                                    return res.json( )
                                }).then( data => {
                                    if ( data === 'email already use' ){
                                        showPushNotification( 'error', "Adresse email déjà utilisée" )
                                    } else {
                                        showPushNotification( 'success', "Compte créé, vous pouvez vous connecter" )
                                        hideModal( )
                                    }
                            })
                        }
                    }
                }
            })
        }
    }

})

function userIsLog( ) {

    document.getElementById( 'loginRegister' ).innerHTML = userMenuHTML
    document.getElementById( 'logoutMenu' ).addEventListener( 'click', e => {
        e.preventDefault( )
        localStorage.removeItem( 'userLocal' )
        userIsNotLog( )
        showPushNotification( 'success', "Déconnection réussi !" )
    })

}

function userIsNotLog( ) {

    document.getElementById( 'loginRegister' ).innerHTML = loginLogoutFormHTML

}