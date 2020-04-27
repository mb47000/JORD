let pagesList = {
    '#': 'home',
    '#404': '404',
    '#about-me': 'about',
    '#mon-compte': 'useraccount',
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

        if( !this.cache.hasOwnProperty( route ) ) {

            let res = await fetch( this.routes[route] )
            this.cache[route] = await res.text()

        }

        let newRoute = route.replace( '#', '/' )
        history.replaceState( this.cache[route], null, newRoute )

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

window.onpopstate = e => {
    console.log(pagesRoutes.cache[document.location.pathname])
    document.getElementById( 'content' ).innerHTML = pagesRoutes.cache[document.location.pathname.replace('/', '#')]
    document.dispatchEvent( pageReady )
}