document.addEventListener( 'pageReady', e => {
    buildProduct( )
    document.dispatchEvent( initWebsite )
} )

window.addEventListener( 'pageChange', e => buildProduct( ) )

let optionsList = { }
let productPrice

function buildProduct( ) {


    let target = location.pathname.split( '/' ).pop( )
    let productList = localStorage.getItem( 'products' )

    JSON.parse( productList ).forEach( elt => {

        if( elt.slug === target ) {

            document.querySelector( 'h1' ).innerHTML = elt.name
            document.getElementById( 'ref' ).innerHTML = elt.ref
            document.getElementById( 'price' ).innerHTML = productPrice = elt.price

            if( elt.options ) {

                Object.values( elt.options ).forEach( grp => {

                    const groupValues = grp.values

                    if( grp.type === 'checkbox' ){

                        let checkboxGrp = document.createElement( 'div' )

                        checkboxGrp.innerHTML = productsOptionsHTML
                        checkboxGrp.innerHTML = checkboxGrp.querySelector('#checkbox' ).innerHTML

                        checkboxGrp.querySelector('.title' ).innerHTML = grp.name

                        let checkboxGrpHtml = checkboxGrp.querySelector('.checkboxGroup' ).innerHTML
                        checkboxGrp.querySelector('.checkboxGroup' ).innerHTML = ''

                        groupValues.forEach( e => {

                            optionsList[ e.ref ] = e.price

                            let checkboxElem = document.createElement('div' )
                            checkboxElem.innerHTML = checkboxGrpHtml

                            let input = checkboxElem.querySelector('input' )
                            let label = checkboxElem.querySelector('label' )

                            input.id = input.value = e.ref
                            label.setAttribute('for', e.ref )
                            label.innerHTML = e.name

                            checkboxGrp.querySelector('.checkboxGroup' ).innerHTML = checkboxGrp.querySelector('.checkboxGroup' ).innerHTML.concat( checkboxElem.innerHTML )


                        } )

                        document.getElementById( 'options' ).innerHTML = document.getElementById( 'options' ).innerHTML.concat( checkboxGrp.innerHTML )

                    } else if( grp.type === 'select' ){


                        let selectGrp = document.createElement( 'div' )

                        selectGrp.innerHTML = productsOptionsHTML
                        selectGrp.innerHTML = selectGrp.querySelector('#select' ).innerHTML

                        selectGrp.querySelector('.title' ).innerHTML = grp.name

                        let selectGrpHtml = selectGrp.querySelector('.selectGroup' ).innerHTML
                        selectGrp.querySelector('.selectGroup' ).id = grp.ref

                        groupValues.forEach( e => {

                            optionsList[ e.ref ] = e.price

                            let optSelect = document.createElement('div' )
                            optSelect.innerHTML = selectGrpHtml
                            optSelect.querySelector('option' ).id = optSelect.querySelector('option' ).value = e.ref
                            optSelect.querySelector('option' ).innerHTML = e.name

                            selectGrp.querySelector('.selectGroup' ).innerHTML = selectGrp.querySelector('.selectGroup' ).innerHTML.concat( optSelect.innerHTML )

                        } )

                        document.getElementById( 'options' ).innerHTML = document.getElementById( 'options' ).innerHTML.concat( selectGrp.innerHTML )

                    }

                } )

                document.getElementById('options' ).addEventListener( 'click', e => e.target.classList.contains( 'optProduct' ) ? calcProductPrice( ) : null )

            } else {

                document.getElementById('options' ).remove( )

            }

        }

    } )

}

function calcProductPrice( ) {

    let totalPrice = parseFloat( productPrice )

    document.getElementById('options' ).querySelectorAll('.optProduct' ).forEach(opt => {
        if( ( opt.selected === true || opt.checked === true ) && opt.value !== '' )
            totalPrice += parseFloat( optionsList[ opt.id ] )
    } )

    document.getElementById('price' ).innerHTML = totalPrice.toFixed(2 )

}
