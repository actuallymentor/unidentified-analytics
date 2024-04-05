/**
 * Retrieves historical statistics for a given namespace.
 * @param {Object} options - The options object.
 * @param {Object} options.data - The data object containing the namespace.
 * @param {string} options.data.namespace - The namespace for which to retrieve the historical statistics.
 * @returns {Promise<Object>} - A promise that resolves to the historical statistics object.
 * @returns {Object[]} returns.history - An array of historical statistics objects.
 */
export async function get_historical_stats( { data } ) {

    try {

        // Import function dependencies
        const { db, dataFromSnap } = await import( './firebase.mjs' )
        const { log } = await import( './helpers.mjs' )

        // Max update frequency
        const history_length = 30
        const max_data_age_in_ms = 1000 * 60 * 60
        const refresh_timestamp = Date.now() - max_data_age_in_ms

        // Get namespace stats
        const { namespace } = data
        const namespace_stats = await db().collection( `historical_stats` ).doc( namespace ).get().then( snap => dataFromSnap( snap, false ) )

        // Check if data is fresh
        if( namespace_stats?.updated >= refresh_timestamp ) {
            log( `Data is fresh, returning cache` )
            return namespace_stats
        }

        // If data is not fresh, update and return
        let last_days_of_data = await db().collection( `daily_statistics` ).where( 'namespace', '==', namespace ).orderBy( 'updated', 'desc' ).limit( history_length ).get().then( dataFromSnap )
        log( `Got ${ last_days_of_data?.length } days of data: `, last_days_of_data )
        
        // Explicitly set empty keys to zero
        last_days_of_data = last_days_of_data.map( data => ( {
            ...data,
            unique_ips: data.unique_ips || 0,
            touches: data.touches || 0
        } ) )

        const history_object = {
            history: last_days_of_data,
            updated: Date.now(), updated_human: new Date().toString()
        }

        // Write new history object
        log( `History object: `, history_object )
        await db().collection( `historical_stats` ).doc( namespace ).set( history_object )

        // Return data to frontend
        return history_object


    } catch ( e ) {
        console.error( `Error getting stats: `, e )
    }

}

/**
 * Migrates IP data to hashed data.
 * @returns {Promise<void>} - A promise that resolves when the migration is complete.
 */
export async function migrate_ip_data_to_hashed_data( { data } ) {

    // Load all touches
    const { db, dataFromSnap } = await import( './firebase.mjs' )
    const { log, emulator, wait } = await import( './helpers.mjs' )
    const { createHash } = await import( 'crypto' )
    const start = Date.now()

    // if this is not a dev environment, return
    if( !emulator ) {
        log( `This function can only be run in a development environment` )
        return
    }

    // Get all touches
    let touches = await db().collection( `touches` ).get().then( dataFromSnap )
    log( `Got ${ touches?.length } touches` )

    // Filter out touches that have already been migrated
    touches = touches.filter( touch => !touch.migrated )
    log( `Filtered out ${ touches?.length } touches that need to be migrated` )

    // Map over the touches and hash the ip
    const hashed_touches = touches.map( touch => {
        const { ip, ...rest } = touch
        return {
            ...rest,
            ip: createHash( 'sha256' ).update( ip ).digest( 'hex' )
        }
    } )
    log( `Hashed ${ hashed_touches?.length } touches, exerpt:`, hashed_touches.slice( 0, 1 ) )

    // Split the touches into chunks of 500
    const chunk_size = 500
    const chunks = []
    for( let i = 0; i < hashed_touches.length; i += chunk_size ) {
        chunks.push( hashed_touches.slice( i, i + chunk_size ) )
    }
    log( `Split touches into ${ chunks.length } chunks` )

    // Loop over the chunks, and promise.all write them to firestore
    let total_written = 0
    for( const chunk of chunks ) {

        // Write the chunk and mark the touch as migrated
        const queue = () => chunk.map( ( { id, ...touch } ) => Promise.all( [
            db().collection( 'hashed_touches' ).doc( id ).set( touch ),
            db().collection( 'touches' ).doc( id ).set( { migrated: true }, { merge: true } )
        ] ) )

        // Write the chunk with a very naive retry mechanism to work around firebase limits
        await Promise.all( queue() ).catch( async e => {
            // Trying again, but waiting for 10 seconds
            log( `Error writing chunk, waiting 10 seconds before retrying` )
            await wait( 10000 )
            await Promise.all( queue() )
        } ).catch( async e => {
            // Trying again, but waiting for 30 seconds
            log( `Error writing chunk, waiting 10 seconds before retrying` )
            await wait( 30000 )
            await Promise.all( queue() )
        } ).catch( e => log( `Error writing chunk: `, e ) )

        total_written += chunk.length
        const seconds_elapsed = ( Date.now() - start ) / 1000
        log( `Wrote chunk of ${ chunk.length } touches, progress: ${ Math.round( total_written / hashed_touches.length * 100 ) }% in ${ seconds_elapsed } seconds` )
    }

}