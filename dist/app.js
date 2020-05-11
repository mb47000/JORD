let dbReady = new CustomEvent( 'dbReady', { bubbles: true } )
let pageReady = new CustomEvent( 'pageReady', { bubbles: true } )
let pageChange = new CustomEvent( 'pageChange', { bubbles: true } )
let initWebsite = new CustomEvent( 'initWebsite', { bubbles: true } )

let routeList = [ ]
let route
let currentPage
let routes = { }

;( ( ) => { fetch( '/api/get?name=pages' )

    .then( res => { return res.json( ) } )

    .then( data => {

        let folder = '../views/pages/'

        data.forEach( e => {
            let newPage = {
                'slug': e.slug,
                'fileName': folder + e.fileName + '.html',
                'title': e.title,
                'access': e.access,
            }
            routeList.push( newPage )
        })

        Object.assign( routes, routeList )

        loadProducts( )

    } )

} )( );

function loadProducts( ) { fetch( '/api/get?name=products' )

    .then( res => { return res.json( ) } )

    .then( data => {

        let folder = '../views/templates/'

        data.forEach( e => {
            let newPage = {
                'slug': e.slug,
                'fileName': folder + 'product.html',
                'title': e.name,
                'access': e.access,
            }
            routeList.push( newPage )
        })

        Object.assign( routes, routeList )

        document.dispatchEvent( dbReady )

        localStorage.setItem( 'products', JSON.stringify( data ) )

    } )

};

class Router {

    constructor( routes ) {

        this.routes = routes
        this.cache = { }

        window.addEventListener( 'hashchange', this.loadPage.bind( this, 'hashchange' ) )
        document.addEventListener( 'dbReady', this.loadPage.bind( this, 'dbReady' ) )
    }

    async loadPage( e, event ){

        route = location.hash || '#'
        currentPage = await Object.values( this.routes ).find( elt => route === `#${elt.slug}` )

        if( currentPage === undefined ){

            route = '#404'
            currentPage = Object.values( this.routes ).find( elt => `#${elt.slug}` === '#404' )
            showPage.bind( this )( )

        } else {

            if( currentPage.access === '1' ){

                let userLocal = localStorage.getItem('userLocal' )

                if( userLocal != null ) {

                    userLocal = JSON.parse(userLocal)
                    let userToken = userLocal.token;

                    ( ( ) => { fetch(`/api/token?token=${userToken}&action=verify` )
                        .then( res => { return res.json( ) } )
                        .then( data => {
                            if ( data != true ) {
                                route = '#401'
                                currentPage = Object.values( this.routes ).find(elt => `#${elt.slug}` === '#401' )
                                showPage.bind( this )( )
                                localStorage.removeItem( 'userLocal' )
                            } else {
                                showPage.bind( this )( )
                            }
                        } )
                    } )( )

                } else {
                    route = '#401'
                    currentPage = Object.values( this.routes ).find(elt => `#${elt.slug}` === '#401' )
                    showPage.bind( this )( )
                }
            } else {
                showPage.bind( this )( )
            }


        }

        async function showPage(  ) {


            if( !this.cache.hasOwnProperty( route ) ) {

                let res = await fetch( currentPage.fileName )
                this.cache[route] = await res.text()

            }

            let newRoute = route.replace( '#', '/' )

            history.replaceState( this.cache[route], null, newRoute )

            document.getElementById( 'content' ).innerHTML = this.cache[route]

            document.querySelector('title').innerHTML = currentPage.title

            if( event.type === 'dbReady' )
                document.dispatchEvent( pageReady )

        }
    }
}

let pagesRoutes = new Router( routes )


window.onpopstate = e => {

    document.getElementById( 'content' ).innerHTML = pagesRoutes.cache[ document.location.pathname.replace( '/', '#' ) ]
    setTimeout(( ) => { document.dispatchEvent( pageChange ) }, 200)

}
window.addEventListener( 'pageReady', e => {
    buildProduct( )
    document.dispatchEvent( initWebsite )
} )
window.addEventListener( 'pageChange', e => buildProduct( ) )

function buildProduct( ){


    let target = location.pathname.split( '/' ).pop( )
    let productList = localStorage.getItem( 'products' )

    JSON.parse( productList ).forEach( elt => {

        if( elt.slug === target ){

            document.querySelector( 'h1' ).innerHTML = elt.name
            document.getElementById( 'ref' ).innerHTML = elt.ref
            document.getElementById( 'price' ).innerHTML = elt.price

        }

    })

}
let userMenuHTML,
    loginLogoutFormHTML,
    cartHTML,
    cartRowHTML,
    userProfilHTML

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

fetch( '../views/parts/userProfil.html', { mode: 'no-cors' } )
    .then( response => response.text( ) )
    .then( data => userProfilHTML = data )
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
} )

window.addEventListener( 'hashchange', hideModal )

function showModal( e ){
    document.querySelectorAll( `[data-modal]` ).forEach( elt => elt.hidden = true )
    document.querySelector( `[data-modal=${e}]` ).hidden = false
}

function hideModal( ){
    document.querySelectorAll( `[data-modal]` ).forEach( elt => elt.hidden = true )
}
let cartLocal

document.addEventListener( 'initWebsite', ( ) => {

    document.getElementById( 'addCart' ) ? document.getElementById( 'addCart' ).addEventListener( 'click', e => addCart( e.target ) ) : null
    document.getElementById( 'cartModal' ).innerHTML = cartHTML

} )

document.body.addEventListener( 'click', e => {

    e.target.closest( '.removeCart' ) ? removeCart( e.target.closest( '.removeCart' ).parentElement.parentElement.parentElement.querySelector( '.refLabel > .value' ).innerHTML ) : null

    e.target.closest( '.plusProduct' ) ? plusMinusProduct( e.target.closest( '.plusProduct' ).closest('.qtyLabel' ), 'plus' ) : null

    e.target.closest( '.minusProduct' ) ? plusMinusProduct( e.target.closest( '.minusProduct' ).closest('.qtyLabel' ), 'minus' ) : null

} )


function refreshCart( ) {

    cartLocal = localStorage.getItem( 'cartLocal' ) ? localStorage.getItem( 'cartLocal' ) : cartLocal = null

    const buttonCart = document.getElementById( 'buttonCart' )
    const carts = document.querySelectorAll('.cart' )

    carts.forEach( e => {
        const tbody = e.getElementsByTagName( 'tbody' )[0]
        tbody.innerHTML = ''
        let totalPrice = 0
        buttonCart.classList.add( 'tooltip' )
        buttonCart.classList.remove( 'buttonModal' )
        buttonCart.removeAttribute('data-modaltarget')

        if ( cartLocal != null ) {

            buttonCart.classList.remove( 'tooltip' )
            buttonCart.classList.add( 'buttonModal' )
            buttonCart.dataset.modaltarget = 'cart'

            JSON.parse( cartLocal ).forEach( e => {

                tbody.innerHTML += cartRowHTML
                tbody.lastElementChild.querySelector( '.refLabel > .value' ).innerHTML = e.ref
                tbody.lastElementChild.querySelector( '.productLabel > .value' ).innerHTML = e.name
                tbody.lastElementChild.querySelector( '.priceLabel > .value' ).innerHTML = e.price
                tbody.lastElementChild.querySelector( '.qtyLabel > .value' ).innerHTML = e.qty
                tbody.lastElementChild.querySelector( '.totalLabel > .value' ).innerHTML = e.price * e.qty
                totalPrice += e.price * e.qty

            })

            tbody.nextElementSibling.lastElementChild.querySelector( '.value' ).innerHTML = totalPrice.toFixed(2)


        } else {

        }
    });

    localStorage.getItem( 'userLocal' ) ? saveCart(  ) : null
    refreshCounter( )

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

function removeCart( ref ){

    let newData = [ ]
    JSON.parse( cartLocal ).forEach( e => e.ref === ref ? null : newData.push( e ) )
    newData.length <= 0 ? ( localStorage.removeItem( 'cartLocal' ), refreshCart( ), hideModal( ) ) : ( localStorage.setItem( 'cartLocal', JSON.stringify( newData ) ), refreshCart( ) )

}

function refreshCounter( ){

    let cartCount = document.getElementById('cartProductNumber')
    let modalCart = document.getElementById( 'cartModal' )

    cartCount ? cartCount.innerHTML = modalCart.querySelectorAll('.productLabel').length : null

}

function plusMinusProduct( e, type ) {

    let refLabel = e.parentElement.querySelector('.refLabel' ).firstElementChild.innerHTML
    let value = type === 'plus' ? parseInt( e.querySelector('.value' ).innerHTML ) + 1 : parseInt( e.querySelector('.value' ).innerHTML ) - 1

    value === 0 ? value = 1 : null

    e.querySelector('.value' ).innerHTML = value

    cartLocal = JSON.parse( localStorage.getItem( 'cartLocal' ) )
    cartLocal.forEach( e => e.ref === refLabel ? e.qty = value : null )
    localStorage.setItem( 'cartLocal', JSON.stringify( cartLocal ) )
    refreshCart( )

}

function saveCart( ){

    let cartLocal = localStorage.getItem('cartLocal' ) ? localStorage.getItem('cartLocal' ) : 'null'
    let userLocal = JSON.parse( localStorage.getItem('userLocal' ) )

    fetch( `/api/cart?token=${userLocal.token}&email=${userLocal.email}&action=saveCart`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: cartLocal,
    } )

}

function getCart( ){

    let cartLocal = localStorage.getItem('cartLocal' ) ? localStorage.getItem('cartLocal' ) : {}
    let userLocal = JSON.parse( localStorage.getItem('userLocal' ) )

    fetch( `/api/cart?token=${userLocal.token}&email=${userLocal.email}&action=getCart`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: cartLocal,
    } )
        .then( res => {
            return res.json( )
        }).then( data => {
            if ( data === false ){
                showPushNotification( 'error', "Session expirée" )
            } else if( data != 'null' ) {
                localStorage.setItem( 'cartLocal', data )
            }
        }).then( ( ) => refreshCart( ) )

}

document.addEventListener( 'initWebsite', function() {

    let userLocal = localStorage.getItem( 'userLocal' )

    if ( userLocal ) {

        userIsLog( )

    } else {

        document.getElementById( 'loginRegister' ).innerHTML = loginLogoutFormHTML

        loginRegister( 'modal' )

    }

    document.querySelectorAll('.accountUserPage').forEach(elt => {

        elt.innerHTML = userProfilHTML

        getUserProfilPage( document.getElementById('accountUserPage' ) )

    })

})

document.addEventListener( 'pageChange', () => {

    document.querySelectorAll('.accountUserPage').forEach(elt => {

        elt.innerHTML = userProfilHTML

        getUserProfilPage( document.getElementById('accountUserPage' ) )

    })

})

function getUserProfilPage( content ){

    writeData( )

    let userLocal = JSON.parse( localStorage.getItem('userLocal' ) )

    content.addEventListener('click', e => {

        if( e.target.classList.contains( 'editProfil' ) ){

            let section = e.target.closest( '.section' ).nextElementSibling
            let inputs = section.querySelectorAll('input')
            let labelsSpan = section.querySelectorAll('.labelSpan')
            let button = section.querySelector('.buttonSection')

            inputs.forEach(elt => {
                elt.hidden = false
            })
            labelsSpan.forEach(elt => {
                elt.hidden = true
            })
            button.hidden = false
        }

        if( e.target.closest('.saveProfil') ){

            let dataSend = {
                'email':                userLocal.email,
                'firstname':            document.getElementById('firstnameField').nextElementSibling.value,
                'lastname':             document.getElementById('lastnameField').nextElementSibling.value,
                'address':              document.getElementById('addressField').nextElementSibling.value,
                'postalCode':           document.getElementById('postalcodeField').nextElementSibling.value,
                'town':                 document.getElementById('townField').nextElementSibling.value,
                'shipping_address':     document.getElementById('addressShippingField').nextElementSibling.value,
                'shipping_postalCode':  document.getElementById('postalcodeShippingField').nextElementSibling.value,
                'shipping_town':        document.getElementById('townShippingField').nextElementSibling.value,
            }

            fetch( `/api/updateUser?token=${userLocal.token}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify( dataSend ),
            } )
                .then( res => {
                    return res.json( )
                }).then( data => {
                    if ( data === false ){
                        showPushNotification( 'error', "Session expirée" )
                    } else {
                        localStorage.setItem( 'userLocal', JSON.stringify( data ) )
                        showPushNotification( 'success', "Informations sauvegardées" )
                        writeData( )
                        cancelEdit( )
                    }
            } )
        }

        if ( e.target.classList.contains( 'editPassword' ) ) {

            let newPass         = document.getElementById('newPassword' ).value
            let confirmPass     = document.getElementById('confirmPassword' ).value
            let oldPass         = document.getElementById('oldPassword' ).value
            let email           = document.getElementById('emailField').innerHTML

            const regexPatPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+\-=]*.{8,25}$/
            const pwdCheck = regexPatPwd.test( newPass )

            pwdCheck ? editPassword( ) : showPushNotification( 'error', "Le mot de passe doit contenir 8 à 25 caractères et au moins 1 majuscule, 1 minuscule et 1 chiffre." )

            function editPassword( ){
                if ( newPass === confirmPass ) {

                    fetch( `/api/updatePwd?email=${email}&password=${oldPass}&newPassword=${newPass}` )
                        .then( res => {
                            return res.json( )
                        })
                        .then( data => {
                            if ( data === 'user not found' ) {
                                showPushNotification( 'error', "Email incorrect" )
                            } else if ( data === 'incorrect password' ) {
                                showPushNotification( 'error', "Mauvais mot de passe" )
                            } else if ( data === 'password updated') {
                                showPushNotification( 'success', "Modification du mot de passe réussi" )
                                document.getElementById('newPassword' ).value = ''
                                document.getElementById('confirmPassword' ).value = ''
                                document.getElementById('oldPassword' ).value = ''
                                cancelEdit( )
                            }
                        })
                } else {
                    showPushNotification( 'error', "Le nouveau mot de passe n'est pas identique à la confirmation" )
                }
            }


        }

        if( e.target.classList.contains( 'cancelSave' ) ){

            cancelEdit( )

        }


    })

}

function cancelEdit( ){
    let inputs = document.querySelectorAll('input' )
    let labelsSpan = document.querySelectorAll('.labelSpan' )
    let button = document.querySelectorAll('.buttonSection' )
    inputs.forEach(elt => {
        elt.hidden = true
    })
    labelsSpan.forEach(elt => {
        elt.hidden = false
    })
    button.forEach(elt => {
        elt.hidden = true
    })
}

function writeData( ){

    let userLocal = localStorage.getItem( 'userLocal' )
    userLocal = JSON.parse( userLocal )

    document.getElementById('emailField' ).innerHTML                 = userLocal.email
    document.getElementById('firstnameField' ).innerHTML             = document.getElementById('firstnameField' ).nextElementSibling.value            = userLocal.firstname
    document.getElementById('lastnameField' ).innerHTML              = document.getElementById('lastnameField' ).nextElementSibling.value             = userLocal.lastname
    document.getElementById('addressField' ).innerHTML               = document.getElementById('addressField' ).nextElementSibling.value              = userLocal.address
    document.getElementById('postalcodeField' ).innerHTML            = document.getElementById('postalcodeField' ).nextElementSibling.value           = userLocal.postalCode
    document.getElementById('townField' ).innerHTML                  = document.getElementById('townField' ).nextElementSibling.value                 = userLocal.town
    document.getElementById('addressShippingField' ).innerHTML       = document.getElementById('addressShippingField' ).nextElementSibling.value      = userLocal.shipping_address
    document.getElementById('postalcodeShippingField' ).innerHTML    = document.getElementById('postalcodeShippingField' ).nextElementSibling.value   = userLocal.shipping_postalCode
    document.getElementById('townShippingField' ).innerHTML          = document.getElementById('townShippingField' ).nextElementSibling.value         = userLocal.shipping_town

}

function userIsLog( ) {


    localStorage.getItem('cartLocal' ) ? refreshCart( ) : getCart( )
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
    localStorage.removeItem('cartLocal' )
    refreshCart( )


}

function loginRegister( location ){

    let loginForms = document.querySelectorAll( '.loginRegisterForm' )

    loginForms.forEach( e => {
        let switchForm = e.querySelector( '.switchForm' )
        let buttonSubmit = e.querySelector( '.buttonSend' )

        switchForm.addEventListener( 'click',  elt => {

            elt.preventDefault( )
            buttonSubmit.classList.contains( 'loginSubmit' ) ? switchToRegister( ) : switchToLogin( )

            function switchToLogin( ) {
                switchForm.innerHTML = "Pas encore enregistré"
                e.querySelector( 'legend' ).innerHTML = "S'identifier"
                e.confirmPassword.hidden = true
                buttonSubmit.value = "Connexion"
                buttonSubmit.classList.toggle( 'loginSubmit' )
            }

            function switchToRegister( ) {
                switchForm.innerHTML = "J'ai déjà un compte"
                e.querySelector( 'legend' ).innerHTML = "S'enregistrer"
                e.confirmPassword.hidden = false
                buttonSubmit.value = "Inscription"
                buttonSubmit.classList.toggle( 'loginSubmit' )
            }
        })

        if ( e ){

            e.addEventListener( 'submit', async( elt ) => {

                elt.preventDefault( )
                let param = '?'

                if( elt.target.monprenom.value === '' & elt.target.monadresse.value === 'ceci est mon adresse' ) {
                    let data = new FormData( elt.target )

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
                                    localStorage.setItem( 'userLocal', JSON.stringify( data ) )
                                    showPushNotification( 'success', "Connexion réussi !" )
                                    location === 'modal' ? hideModal( ) : purchase( 'step2' )
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
    })

}
document.addEventListener( 'initWebsite', ( ) => {

    document.getElementById('purchase' ) ? purchase( 'step1' ) : null

} )
document.addEventListener( 'pageChange', ( ) => {

    document.getElementById('purchase' ) ? purchase( 'step1' ) : null

} )

function purchase( step ){

    let purchaseElem = document.getElementById('purchase' )
    let content = purchaseElem.querySelector('.content' )
    let purchaseBtn

    if ( step === 'step1' ) {
        content.innerHTML = cartHTML
        purchaseBtn = content.querySelector('.purchaseButton' )
        purchaseBtn.firstElementChild.innerHTML = "Continuer ma commande"
        purchaseBtn.href = "#commander?etape=2"
        refreshCart( )

    } else if ( step === 'step2' ) {
        content.innerHTML = userProfilHTML
        purchaseBtn = content.querySelector('.purchaseButton' )
        purchaseBtn.hidden = false
        purchaseBtn.firstElementChild.innerHTML = "Finaliser ma commande"
        purchaseBtn.href = "#commander?etape=3"
        content.querySelector('.editPassword' ).style.display = 'none'
        getUserProfilPage( content )

    } else if ( step === 'step3' ) {
        let allLabelSpan = document.querySelectorAll('.labelSpan' )
        purchaseBtn = content.querySelector('.purchaseButton' )
        const isNotEmpty = elem => elem > 0
        let labelSpanArray = [ ]
        allLabelSpan.forEach(elt => {
            labelSpanArray.push( elt.innerHTML.length )
        } )
        labelSpanArray.every( isNotEmpty ) ? createOrders( ) : showPushNotification( 'error', "Veuillez remplir tous les champs" )
    } else if ( step === 'step4' ){

        console.log( 'add payment api' )

    }

    if( purchaseBtn ) {
        purchaseBtn.addEventListener('click', e => {
            e.preventDefault( )
            localStorage.getItem('userLocal' ) ? null : ( content.innerHTML = loginLogoutFormHTML, loginRegister( 'purchase' ) )
            e.target.closest( '.purchaseButton' ).hash === '#commander?etape=2' ? purchase( 'step2' ) : null
            e.target.closest( '.purchaseButton' ).hash === '#commander?etape=3' ? purchase( 'step3' ) : null
        } )
    }
}

function createOrders( ) {

    let userLocal = JSON.parse( localStorage.getItem('userLocal' ) )
    let emailUser = userLocal.email
    let tokenUser = userLocal.token

    fetch( `/api/orders?token=${tokenUser}&email=${emailUser}&action=createOrders` )
        .then( res => {
            return res.json( )
        } ).then( data => {
            data === 'order created' ? purchase( 'step4' ) : showPushNotification( 'error', "Une erreur est survenue, merci de contacter l'adminitrateur" )
        } )

}