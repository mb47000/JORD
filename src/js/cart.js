let cartLocal

document.addEventListener( 'initWebsite', ( ) => {

    document.getElementById( 'addCart' ) ? document.getElementById( 'addCart' ).addEventListener( 'click', e => addCart( e.target ) ) : null
    document.getElementById( 'cartModal' ).innerHTML = cartHTML
    refreshCart( )

} )

document.body.addEventListener( 'click', e => {

    e.target.closest( '.removeCart' ) ? removeCart( e.target.closest( '.removeCart' ).parentElement.parentElement.parentElement.querySelector( '.refLabel > .value' ).innerHTML ) : null

    e.target.closest( '.plusProduct' ) ? plusMinusProduct( e.target.closest( '.plusProduct' ).closest('.qtyLabel' ), 'plus' ) : null

    e.target.closest( '.minusProduct' ) ? plusMinusProduct( e.target.closest( '.minusProduct' ).closest('.qtyLabel' ), 'minus' ) : null

} )


function refreshCart( ) {

    cartLocal = localStorage.getItem( 'cartLocal' ) ? localStorage.getItem( 'cartLocal' ) : cartLocal = null

    const buttonCart = document.getElementById( 'buttonCart' )
    const tbody = document.getElementById( 'cart' ).getElementsByTagName( 'tbody' )[0]
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

        tbody.nextElementSibling.lastElementChild.querySelector( '.value' ).innerHTML = totalPrice


    } else {



    };

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

    cartCount ? cartCount.innerHTML = document.querySelectorAll('.productLabel').length : null

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
    console.log('save cart')
    console.log( cartLocal )

    fetch( `/api/cart?token=${userLocal.token}&email=${userLocal.email}&action=saveCart`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: cartLocal,
    } )
    //     .then( res => {
    //         return res.json( )
    //     }).then( data => {
    //     console.log( data )
    //     if ( data === false ){
    //         showPushNotification( 'error', "Session expirée" )
    //     } else {
    //         console.log( data )
    //     }
    // })

}

function getCart( ){

    let cartLocal = localStorage.getItem('cartLocal' )
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