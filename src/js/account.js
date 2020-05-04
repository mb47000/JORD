
document.addEventListener( 'initWebsite', function() {

    let userLocal = localStorage.getItem( 'userLocal' )

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
                buttonSubmit.value = "Connexion"
                buttonSubmit.classList.toggle( 'loginSubmit' )
            }

            function switchToRegister( ) {
                switchForm.innerHTML = "J'ai déjà un compte"
                loginForm.querySelector( 'legend' ).innerHTML = "S'enregistrer"
                loginForm.confirmPassword.hidden = false
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
                                    showPushNotification( 'error', "Email incorrect" )
                                } else if ( data === 'incorrect password' ) {
                                    showPushNotification( 'error', "Mauvais mot de passe" )
                                } else {
                                    localStorage.setItem( 'userLocal', JSON.stringify( data ) )
                                    showPushNotification( 'success', "Connexion réussi !" )
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

                        const regexPatPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()_+\-=]*.{8,25}$/
                        const pwdCheck = regexPatPwd.test( dataSend.password )
                        pwdCheck ? null : showPushNotification( 'error', "Le mot de passe doit contenir 8 à 25 caractères et au moins 1 majuscule, 1 minuscule et 1 chiffre." )

                        if ( pwdCheck && dataSend.password === dataSend.confirmPassword ){
                            param = param.slice( 0, -1 )

                            fetch( `/api/register${param}` )
                                .then( res => {
                                    return res.json( )
                                }).then( data => {
                                    if ( data === 'email already use' ){
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

    let userAccountElement = document.getElementById('accountUserPage' )
    if( userAccountElement ){

        writeData( )

        userAccountElement.addEventListener('click', e => {

            if( e.target.classList.contains('editProfil' ) ){

                let section = e.target.closest( '.section' ).nextElementSibling
                let inputs = section.querySelectorAll('input')
                let labelsSpan = section.querySelectorAll('.labelSpan')
                let button = section.querySelector('.buttonSection')

                inputs.forEach(elt => {
                    elt.hidden = false
                })
                labelsSpan.forEach(elt => {
                    elt.hidden = true
                })
                button.hidden = false
            }

            if( e.target.closest('.saveProfil') ){

                let dataSend = {
                    'email':                userLocal.email,
                    'firstname':            document.getElementById('firstnameField').nextElementSibling.value,
                    'lastname':             document.getElementById('lastnameField').nextElementSibling.value,
                    'address':              document.getElementById('addressField').nextElementSibling.value,
                    'postalCode':           document.getElementById('postalcodeField').nextElementSibling.value,
                    'town':                 document.getElementById('townField').nextElementSibling.value,
                    'shipping_address':     document.getElementById('addressShippingField').nextElementSibling.value,
                    'shipping_postalCode':  document.getElementById('postalcodeShippingField').nextElementSibling.value,
                    'shipping_town':        document.getElementById('townShippingField').nextElementSibling.value,
                }

                fetch( `/api/updateUser?token=${userLocal.token}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(dataSend),
                } )
                    .then( res => {
                        return res.json( )
                    }).then( data => {
                        if ( data === false ){
                            showPushNotification( 'error', "Session expirée" )
                        } else {
                            localStorage.setItem( 'userLocal', JSON.stringify(data) )
                            showPushNotification( 'success', "Informations sauvegardées" )
                            writeData( )
                            cancelEdit( )
                        }
                })
            }

            if( e.target.classList.contains('editPassword' ) ){

                let newPass         = document.getElementById('newPassword' ).value
                let confirmPass     = document.getElementById('confirmPassword' ).value
                let oldPass         = document.getElementById('oldPassword' ).value
                let email           = document.getElementById('emailField').innerHTML

                if( newPass === confirmPass ){

                    fetch( `/api/updatePwd?email=${email}&password=${oldPass}&newPassword=${newPass}` )
                        .then( res => {
                            return res.json( )
                        })
                        .then( data => {
                            if ( data === 'user not found' ) {
                                showPushNotification( 'error', "Email incorrect" )
                            } else if ( data === 'incorrect password' ) {
                                showPushNotification( 'error', "Mauvais mot de passe" )
                            } else if ( data === 'password updated') {
                                showPushNotification( 'success', "Modification du mot de passe réussi" )
                                document.getElementById('newPassword' ).value = ''
                                document.getElementById('confirmPassword' ).value = ''
                                document.getElementById('oldPassword' ).value = ''
                                cancelEdit( )
                            }
                        })
                } else {
                    showPushNotification( 'error', "Le nouveau mot de passe n'est pas identique à la confirmation" )
                }


            }

            if( e.target.classList.contains('cancelSave' ) ){

                cancelEdit( )

            }


        })

        function cancelEdit( ){
            let inputs = document.querySelectorAll('input' )
            let labelsSpan = document.querySelectorAll('.labelSpan' )
            let button = document.querySelectorAll('.buttonSection' )
            inputs.forEach(elt => {
                elt.hidden = true
            })
            labelsSpan.forEach(elt => {
                elt.hidden = false
            })
            button.forEach(elt => {
                elt.hidden = true
            })
        }

        function writeData( ){

            userLocal = localStorage.getItem( 'userLocal' )
            userLocal = JSON.parse( userLocal )

            document.getElementById('emailField' ).innerHTML                 = userLocal.email
            document.getElementById('firstnameField' ).innerHTML             = document.getElementById('firstnameField' ).nextElementSibling.value            = userLocal.firstname
            document.getElementById('lastnameField' ).innerHTML              = document.getElementById('lastnameField' ).nextElementSibling.value             = userLocal.lastname
            document.getElementById('addressField' ).innerHTML               = document.getElementById('addressField' ).nextElementSibling.value              = userLocal.address
            document.getElementById('postalcodeField' ).innerHTML            = document.getElementById('postalcodeField' ).nextElementSibling.value           = userLocal.postalCode
            document.getElementById('townField' ).innerHTML                  = document.getElementById('townField' ).nextElementSibling.value                 = userLocal.town
            document.getElementById('addressShippingField' ).innerHTML       = document.getElementById('addressShippingField' ).nextElementSibling.value      = userLocal.shipping_address
            document.getElementById('postalcodeShippingField' ).innerHTML    = document.getElementById('postalcodeShippingField' ).nextElementSibling.value   = userLocal.shipping_postalCode
            document.getElementById('townShippingField' ).innerHTML          = document.getElementById('townShippingField' ).nextElementSibling.value         = userLocal.shipping_town

        }

    }


})

function userIsLog( ) {


    localStorage.getItem('cartLocal' ) ? refreshCart( ) : getCart( )
    document.getElementById( 'loginRegister' ).innerHTML = userMenuHTML
    document.getElementById( 'logoutMenu' ).addEventListener( 'click', e => {
        e.preventDefault( )
        localStorage.removeItem( 'userLocal' )
        userIsNotLog( )
        showPushNotification( 'success', "Déconnection réussi !" )
    })

}

function userIsNotLog( ) {

    document.dispatchEvent( dbReady )
    document.getElementById( 'loginRegister' ).innerHTML = loginLogoutFormHTML
    localStorage.removeItem('cartLocal' )

}

