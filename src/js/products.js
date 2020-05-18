document.addEventListener( 'pageReady', e => {
    buildProduct( )
    productsPage( )
    document.dispatchEvent( initWebsite )
} )

window.addEventListener( 'pageChange', e => {
    buildProduct( )
    productsPage( )
} )

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

function productsPage( cat = 'all', count = -1 ) {

    let productsPage = document.getElementById( 'productsPage' )
    if( productsPage ) {

        let productsList = JSON.parse( localStorage.getItem( 'products' ) )

        let counter = 1

        productsList.forEach( prod => {

            let thisProd

            cat !== 'all' && prod.category === cat ?  thisProd = prod : cat === 'all' ? thisProd = prod : null

            if ( thisProd && ( counter <= count || count === -1 ) ) {
                counter++
                let prodCardHTML = document.createElement( 'span' )
                prodCardHTML.innerHTML = productCardHTML
                prodCardHTML.querySelector('.productCard' ).href = `#${ thisProd.slug }`
                prodCardHTML.querySelector('.productImg' ).src = thisProd.images[ 0 ]
                prodCardHTML.querySelector('.productName' ).innerHTML = thisProd.name
                prodCardHTML.querySelector('.productPrice' ).innerHTML = thisProd.price
                productsPage.querySelector('.productsList' ).insertAdjacentHTML( 'beforeend', prodCardHTML.innerHTML )
            }
        } )

    }

}