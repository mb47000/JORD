import EventEmitter from "./EventEmitter.js"

export default class Application extends EventEmitter {

    constructor(opts) {
        super()

        this.router = new Router(opts.container)
        this.init()
    }

    async init( ) {

        await this.router.loadRoutes()
        await this.router.goTo()
        this.dispatchEvent('ready')

    }

    toString() {
        return 'Application'
    }
}

class Router {

    constructor( container ) {

        this.container = container
        this.routes = { }
        this.cache = { }

        window.addEventListener( 'hashchange', () => this.goTo(location.hash) )
    }

    async loadRoutes(  ) {

        const pages = await (await fetch( '/api/get?name=pages' ) ).json( )
        let folder = '../views/pages/'

        for(const page of pages)
            this.routes[page.slug] = {
                'fileName': folder + page.fileName + '.html',
                'title': page.title,
                'access': page.access,
            }

        const products = await (await fetch( '/api/get?name=products' ) ).json( )

        for(const product of products)
            this.routes[product.slug] ={
                'fileName': '../views/templates/product.html',
                'title': product.title,
                'access': product.access,
            }


    }


    async goTo( slug = 'index') {

        if( !this.routes.hasOwnProperty( slug ) )
            slug = '404'

        if( !this.cache.hasOwnProperty( slug ) ) {
            let res = await fetch( this.routes[slug].fileName )
            this.cache[slug] = await res.text()
        }

        const page = this.cache[slug]

        this.container.innerHTML = page

    }


}