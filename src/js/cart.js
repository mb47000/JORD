let cartLocal

document.addEventListener( 'initWebsite', ( ) => {

    document.getElementById( 'addCart' ) ? document.getElementById( 'addCart' ).addEventListener( 'click', e => addCart( e.target ) ) : null
    document.getElementById( 'cartModal' ).innerHTML = cartHTML
    refreshCart( )

} )

document.body.addEventListener( 'click', e => {

    e.target.closest( '.removeCart' ) ? removeCart( e.target.closest( '.removeCart' ).parentElement.parentElement.querySelector( '.refLabel > .value' ).innerHTML ): null

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

    let newData = [ ]
    JSON.parse( cartLocal ).forEach( e => e.ref === ref ? null : newData.push( e ) )
    newData.length <= 0 ? ( localStorage.removeItem( 'cartLocal' ), refreshCart( ), hideModal( ) ) : ( localStorage.setItem( 'cartLocal', JSON.stringify( newData ) ), refreshCart( ) )

}