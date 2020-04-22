let userLocal = localStorage.getItem( 'userLocal' )

document.addEventListener( 'initWebsite', function() {

    if ( userLocal ) {

        userIsLog( )

    } else {

        document.getElementById( 'loginRegister' ).innerHTML = loginLogoutFormHTML

        const loginForm = document.getElementById( 'loginRegisterForm' )
        const switchForm = document.getElementById( 'switchForm' )
        const buttonSubmit = document.getElementById( 'buttonSend' )

        switchForm.addEventListener( 'click', ( e ) => {
            e.preventDefault( )

            buttonSubmit.classList.contains( 'loginSubmit' ) ? switchToRegister( ) : switchToLogin( )

            function switchToLogin( ) {
                switchForm.innerHTML = "Pas encore enregistré"
                loginForm.querySelector( 'legend' ).innerHTML = "S'identifier"
                loginForm.confirmPassword.hidden = true
                loginForm.email.hidden = true
                buttonSubmit.value = "Connexion"
                buttonSubmit.classList.toggle( 'loginSubmit' )
            }

            function switchToRegister( ) {
                switchForm.innerHTML = "J'ai déjà un compte"
                loginForm.querySelector( 'legend' ).innerHTML = "S'enregistrer"
                loginForm.confirmPassword.hidden = false
                loginForm.email.hidden = false
                buttonSubmit.value = "Inscription"
                buttonSubmit.classList.toggle( 'loginSubmit' )
            }
        })

        if ( loginForm ){

            loginForm.addEventListener( 'submit', async( e ) => {

                e.preventDefault( )
                let param = '?'

                if( e.target.monprenom.value === '' & e.target.monadresse.value === 'ceci est mon adresse' ) {
                    let data = new FormData(e.target)

                    if ( buttonSubmit.classList.contains( 'loginSubmit' ) ) {
                        for ( var [key, value] of data.entries( ) ) {
                            param = param.concat( `${key}=${value}&` )
                        }

                        param = param.slice( 0, -1 )

                        fetch( `/api/login${param}` )
                            .then( res => {
                                return res.json( )
                            })
                            .then( data => {
                                if ( data === 'user not found' ) {
                                    showPushNotification( 'error', "Nom d'utilisateur incorrect" )
                                } else if ( data === 'incorrect password' ) {
                                    showPushNotification( 'error', "Mauvais mot de passe" )
                                } else {
                                    localStorage.setItem( 'userLocal', data )
                                    showPushNotification( 'success', "Connexion réussi ! Bonjour " + data[0] )
                                    hideModal( )
                                    userIsLog( )
                                }
                            })
                    } else {

                        let dataSend = { }

                        for ( var [key, value] of data.entries( ) ) {
                            dataSend[key] = value
                            param = param.concat( `${key}=${value}&` )
                        }

                        if( dataSend.password === dataSend.confirmPassword ){
                            param = param.slice( 0, -1 )

                            fetch( `/api/register${param}` )
                                .then( res => {
                                    return res.json( )
                                }).then( data => {
                                    if ( data === 'username already exist' ){
                                        showPushNotification( 'error', "Nom d'utilisateur déjà utilisé" )
                                    } else if ( data === 'email already use' ){
                                        showPushNotification( 'error', "Adresse email déjà utilisée" )
                                    } else {
                                        showPushNotification( 'success', "Compte créé, vous pouvez vous connecter" )
                                        hideModal( )
                                    }
                            })
                        }
                    }
                }
            })
        }
    }

})

function userIsLog( ) {

    document.getElementById( 'loginRegister' ).innerHTML = userMenuHTML
    document.getElementById( 'logoutMenu' ).addEventListener( 'click', e => {
        e.preventDefault( )
        localStorage.removeItem( 'userLocal' )
        userIsNotLog( )
        showPushNotification( 'success', "Déconnection réussi !" )
    })

}

function userIsNotLog( ) {

    document.getElementById( 'loginRegister' ).innerHTML = loginLogoutFormHTML

}