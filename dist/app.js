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



/*
 * ROUTER FOR PAGES
 */
class Router {
    constructor(rootFolder, routes) {
        this.pages = rootFolder;
        this.routes = routes;
        this.cache = {};

        window.addEventListener('hashchange', this.loadPage.bind(this) );
        window.addEventListener('load', this.loadPage.bind(this) );
    }

    async loadPage(e){
        let route = location.hash || '#';
        if(!this.routes.hasOwnProperty(route))
            route = '#404'

        history.pushState('', '', route.replace('#', '/'));

        if( !this.cache.hasOwnProperty(route) ) {
            let res = await fetch(`${this.pages}${this.routes[route]}.html`);
            this.cache[route] = await res.text();
        }
        document.getElementById('content').innerHTML = this.cache[route];

    }
}

route = new Router('../views/pages/', {
    '#': 'home',
    '#404': '404',
    '#about-me': 'about'
});