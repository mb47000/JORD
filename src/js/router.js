/*
 * ROUTER FOR PAGES
 */
class Router {
    constructor(rootFolder, routes) {
        this.pages = rootFolder;
        this.routes = routes;

        window.addEventListener('hashchange', this.loadPage.bind(this) )
        window.addEventListener('load', this.loadPage.bind(this) )
    }

    loadPage(e){
        if( this.routes.hasOwnProperty(location.hash) ) {
            fetch(this.pages + this.routes[location.hash] + '.html', {mode: 'no-cors'})
                .then(response => response.text())
                .then(data => document.getElementById('content').innerHTML = data)
                .catch(error => console.error(error));
        } else if( location.hash === '' ){
            fetch(this.pages + this.routes['#'] + '.html', {mode: 'no-cors'})
                .then(response => response.text())
                .then(data => document.getElementById('content').innerHTML = data)
                .catch(error => console.error(error));
        } else {
            fetch(this.pages + this.routes['404'] + '.html', {mode: 'no-cors'})
                .then(response => response.text())
                .then(data => document.getElementById('content').innerHTML = data)
                .catch(error => console.error(error));
        }
    }
}

route = new Router('../views/pages/', {
    '#': 'home',
    '404': '404',
    '#about': 'about'
});