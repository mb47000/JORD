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
