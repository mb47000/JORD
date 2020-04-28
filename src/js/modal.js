document.body.addEventListener( 'click', e => {
    e.target.dataset.modaltarget != null ? showModal( e.target.dataset.modaltarget ) : e.target.closest( '.modal' ) === null ? hideModal() : null
} )

function showModal( e ){
    document.querySelectorAll( `[data-modal]` ).forEach( elt => elt.hidden = true )
    document.querySelector( `[data-modal=${e}]` ).hidden = false
}

function hideModal( ){
    document.querySelectorAll( `[data-modal]` ).forEach( elt => elt.hidden = true )
}