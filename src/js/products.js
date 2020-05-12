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