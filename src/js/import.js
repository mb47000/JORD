// Create event 'dbReady'
let dbReady = document.createEvent( 'Event' )
dbReady.initEvent( 'dbReady', true, true )

// Create event 'pageReady'
let pageReady = document.createEvent( 'Event' )
pageReady.initEvent( 'pageReady', true, true )

// Create event 'initWebsite'
let initWebsite = document.createEvent( 'Event' )
initWebsite.initEvent( 'initWebsite', true, true )