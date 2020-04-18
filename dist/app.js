// Create event 'dbReady'
let dbReady = document.createEvent('Event')
dbReady.initEvent('dbReady', true, true)

// Create event 'pageReady'
let pageReady = document.createEvent('Event')
pageReady.initEvent('pageReady', true, true)

let initWebsite = document.createEvent('Event')
initWebsite.initEvent('initWebsite', true, true)
/*
 * ROUTER FOR PAGES
 */
class Router {
    constructor(routes) {
        this.routes = routes;
        this.cache = {};

        window.addEventListener('hashchange', this.loadPage.bind(this) );
        document.addEventListener('dbReady', this.loadPage.bind(this) );
    }

    async loadPage(e){
        let route = location.hash || '#';
        if(!this.routes.hasOwnProperty(route))
            route = '#404'

        history.pushState('', '', route.replace('#', '/'));
        if( !this.cache.hasOwnProperty(route) ) {
            let res = await fetch(this.routes[route]);
            this.cache[route] = await res.text();
        }
        document.getElementById('content').innerHTML = this.cache[route]
        document.dispatchEvent(pageReady)
    }
}



let routes = {}

function createRoutesObject(rootFolder, routeList){
    for (let [key, value] of Object.entries(routeList)) {
        routeList[key] = rootFolder + value + '.html';
    }
    Object.assign(routes, routeList)
}

let pagesList = {
    '#': 'home',
    '#404': '404',
    '#about-me': 'about'
}
createRoutesObject('../views/pages/', pagesList);

let pagesRoutes = new Router(routes);
// Get product list and set in local storage
(() => { fetch('/api/productsList')
    .then(res => { return res.json() })
    .then(data => {
        localStorage.setItem('products', JSON.stringify(data))
        let productRoutes = {}
        data.forEach(e => {
            productRoutes['#' + e.slug] = 'product'
        })
        createRoutesObject('../views/templates/', productRoutes)
        document.dispatchEvent(dbReady)
    })
})()

window.addEventListener('pageReady', e => buildProduct() )

function buildProduct(){
    let target = location.pathname.split('/').pop()
    let productList = localStorage.getItem('products')

    JSON.parse(productList).forEach(elt => {
        if(elt.slug === target){
            console.log(elt)
            document.querySelector('h1').innerHTML = elt.name
        }
    })

    document.dispatchEvent(initWebsite)
}
/**
 * FETCH NAVBAR FILES
 */
fetch('../views/parts/navbar.html', {mode: 'no-cors'})
    .then(response => response.text())
    .then(data=> document.getElementById('navbar').innerHTML = data )
    .catch(error => console.error(error));


/**
 * FETCH FOOTER FILES
 */
fetch('../views/parts/footer.html', {mode: 'no-cors'})
    .then(response => response.text())
    .then(data=> document.getElementById('footer').innerHTML = data )
    .catch(error => console.error(error));



window.addEventListener( 'initWebsite', function() {
    const loginForm = document.getElementById('loginForm')
    if ( loginForm ){
        loginForm.addEventListener('submit', async(e) => {
            e.preventDefault()
            let param = '?'
            let data = new FormData(e.target)
            for (var [key, value] of data.entries()) {
                param = param.concat(`${key}=${value}&`)
            }
            param = param.slice(0, -1)

            // Get product list and set in local storage
            fetch(`/api/login${param}`)
                .then((res) => { return res.json() })
                .then((data) => {
                    console.log(data)
                })
        })
    }
} )

