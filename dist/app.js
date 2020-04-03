import * as POUCHDB from '../node_modules/pouchdb/dist/pouchdb.min.js';

let dbReady = new Event('dbReady');
dbReady.initEvent('dbReady', true, true);
let db = new PouchDB('http://127.0.0.1:5984/jord');
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
        document.getElementById('content').innerHTML = this.cache[route];
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


db.query('product', {
    include_docs: true
}).then(function (res){
    let productList = {};
    res.rows.forEach(e => {
        productList['#' + e.doc.slug] = e.doc.file;
    })
    createRoutesObject('../views/products/', productList)
    document.dispatchEvent(dbReady);
}).catch(function (err) {
    console.log(err);
    document.dispatchEvent(dbReady);
});

let pagesRoutes = new Router(routes);
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


