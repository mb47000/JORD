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

