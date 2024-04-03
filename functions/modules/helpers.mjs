export const dev = !!process.env.development

// Dev Logger
export const log = ( ...comments ) => {
    if( dev || process.env.VERBOSE ) console.log( ...comments )
}

// Async waiter
export const wait = ( durationinMs=1000 ) => new Promise( resolve => setTimeout( resolve, durationinMs ) )

// Date helpers
export const YYYY_MM_DD = () => new Date().toISOString().split( 'T' )[0]
export const day_in_ms = () => new Date( YYYY_MM_DD() ).getTime()

