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

let pagesList = {
    '#': 'home',
    '#404': '404',
    '#about-me': 'about'
}

createRoutesObject( '../views/pages/', pagesList )

let pagesRoutes = new Router( routes );