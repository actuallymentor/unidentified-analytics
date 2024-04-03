// ///////////////////////////////
// Development helpers
// ///////////////////////////////
export const dev = import.meta.env.NODE_ENV === 'development' ||  typeof location !== 'undefined' && ( location.href?.includes( 'debug=true' ) || location.href?.includes( 'localhost' ) ) 

export const log = ( ...messages ) => {
    if( dev ) console.log( ...messages )
}

export function setListenerAndReturnUnlistener( parent, event, callback ) {

    if( !parent ) return log( `${ event } listener failed` )

    // Set listener
    parent.addEventListener( event, callback )
    log( `✅ Created ${ event } listener` )

    // Return unsubscriber
    return () => {
        log( `🗑 Unregistering ${ event }` )
        parent.removeEventListener( event, callback )
    }

}

// ///////////////////////////////
// Date helpers
// ///////////////////////////////
export const monthNameToNumber = monthName => {
    const months = [ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ]
    const monthNumber = months.findIndex( month => month.includes( monthName.toLowerCase() ) ) + 1
    return `${ monthNumber }`.length == 1 ? `0${ monthNumber }` : monthNumber
}

// ///////////////////////////////
// Visual
// ///////////////////////////////

export const wait = ( time, error=false ) => new Promise( ( res, rej ) => setTimeout( error ? rej : res, time ) )
export const capitalise = string => `${ string.slice( 0, 1 ).toUpperCase() }${ string.slice( 1, string.length ) }`