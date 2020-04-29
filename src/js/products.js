( ( ) => { fetch( '/api/get?name=products' )

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
    } )

} )( )


window.addEventListener( 'pageReady', e => buildProduct( ) )

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

    document.dispatchEvent( initWebsite )
}