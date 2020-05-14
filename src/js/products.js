window.addEventListener( 'pageReady', e => {
    buildProduct( )
    document.dispatchEvent( initWebsite )
} )

window.addEventListener( 'pageChange', e => buildProduct( ) )

let optionsList = { }

function buildProduct( ) {


    let target = location.pathname.split( '/' ).pop( )
    let productList = localStorage.getItem( 'products' )

    JSON.parse( productList ).forEach( elt => {

        if( elt.slug === target ) {

            document.querySelector( 'h1' ).innerHTML = elt.name
            document.getElementById( 'ref' ).innerHTML = elt.ref
            document.getElementById( 'price' ).innerHTML = elt.price

            if( elt.options ) {

                Object.values( elt.options ).forEach( grp => {

                    console.log(elt.options)

                    const groupValues = grp.values

                    if( grp.type === 'checkbox' ){

                        let checkboxGrp = document.createElement( 'div' )

                        checkboxGrp.innerHTML = productsOptionsHTML
                        checkboxGrp.innerHTML = checkboxGrp.querySelector('#checkbox' ).innerHTML

                        checkboxGrp.querySelector('.title' ).innerHTML = grp.name

                        let checkboxGrpHtml = checkboxGrp.querySelector('.checkboxGroup' ).innerHTML
                        checkboxGrp.querySelector('.checkboxGroup' ).innerHTML = ''

                        groupValues.forEach( e => {

                            optionsList[e.ref] = e.price

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

                            let optSelect = document.createElement('div' )
                            optSelect.innerHTML = selectGrpHtml
                            optSelect.querySelector('option' ).id = optSelect.querySelector('option' ).value = e.ref
                            optSelect.querySelector('option' ).innerHTML = e.name

                            selectGrp.querySelector('.selectGroup' ).innerHTML = selectGrp.querySelector('.selectGroup' ).innerHTML.concat( optSelect.innerHTML )

                        } )

                        document.getElementById( 'options' ).innerHTML = document.getElementById( 'options' ).innerHTML.concat( selectGrp.innerHTML )

                    }

                } )

                console.log(optionsList)
                document.getElementById('options' ).addEventListener( 'click', e => e.target.classList.contains( 'optProduct' ) ? calcProductPrice( e.target ) : null )

            } else {

                document.getElementById('options' ).remove()

            }

        }

    } )

}

function calcProductPrice( e ) {

    console.log( e.parentElement )
    // console.log( optionsList[e.value] )

    // TODO : Add/Remove select option and calc Total


}
