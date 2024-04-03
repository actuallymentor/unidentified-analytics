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