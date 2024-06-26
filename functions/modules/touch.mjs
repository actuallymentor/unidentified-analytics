/**
 * Registers a touch event and saves the IP address in the database.
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @returns {Promise<void>} - A promise that resolves when the touch event is registered.
 */
export async function register_touch( request, response ) {

    let { ip: request_ip, ips, query: { namespace } } = request
    let ip = request_ip || ips[0] || request.get( 'x-forwarded-for' )
    const empty_svg = comment => `<svg width="1" height="1" viewBox="0 0 1 1" fill="none" xmlns="http://www.w3.org/2000/svg"><!-- ${ comment } --></svg>`

    try {

        // Import function dependencies
        const { db } = await import( './firebase.mjs' )

        // Get ip from touch 
        if( !namespace ) return response.status( 400 ).send( 'missing namespace' )
        namespace = `${ namespace }`.toLowerCase()

        // Hash the ip into a sha256
        const { createHash } = await import( 'crypto' )
        ip = createHash( 'sha256' ).update( ip ).digest( 'hex' )

        // Dev only debug trace
        // const { log } = await import( './helpers.mjs' )
        // if( !request_ip ) log( 'Ips: ', request_ip, ips[0], request.get( 'x-forwarded-for' ) )

        // Register touch in backend
        await db().collection( `hashed_touches` ).add( {
            ip,
            updated: Date.now(),
            updated_human: new Date().toString(),
            namespace
        } )

        // Set mimetype
        response.set( 'Content-Type', 'image/svg+xml' )

        return response.send( empty_svg( `touch success for ${ ip }` ) )

    } catch ( e ) {
        console.error( `Error registering touch: `, e )
        response.status( 500 ).send( empty_svg( `touch error for ${ ip }` ) )
    }

}

/**
 * Collates touch count and updates tracking and daily statistics.
 * @param {Object} event - The event object.
 * @returns {Promise<void>} - A promise that resolves when the touch count is updated.
 */
export async function collate_touch_count( event ) {

    try {

        // Import function dependencies
        const { db, dataFromSnap } = await import( './firebase.mjs' )
        const { log, YYYY_MM_DD, day_in_ms } = await import( './helpers.mjs' )
        const { FieldValue } = await import( 'firebase-admin/firestore' )
        const { increment } = FieldValue

        // Get the ip of the nre touch
        const { ip, namespace } = dataFromSnap( event.data )

        // Check if this is the first touch of this ip
        const touches = await db().collection( `hashed_touches` ).where( 'ip', '==', ip ).where( 'namespace', '==', namespace ).limit( 2 ).get().then( dataFromSnap )
        const is_first_touch_of_ip = touches?.length == 1
        log( `This ${ namespace } touch ${ is_first_touch_of_ip ? 'is' : 'is not' } the first of this ip` )

        // UTC based YYYY-mm-dd, the the correcponding ms so future cutoff filtering it possible
        const day = YYYY_MM_DD()
        const day_ms = day_in_ms()

        // Update tracking
        const statistics_object = {
            touches: increment( 1 ),
            ... is_first_touch_of_ip && { unique_ips: increment( 1 ) },
            updated: Date.now(),
            updated_human: new Date().toString()
        }
        log( `Updating to: `, statistics_object )
        await db().collection( `statistics` ).doc( namespace ).set( statistics_object, { merge: true } )

        // Daily tracking
        const daily_stats_object = {
            namespace,
            day,
            day_ms,
            touches: increment( 1 ),
            ... is_first_touch_of_ip && { unique_ips: increment( 1 ) },
            updated: Date.now(),
            updated_human: new Date().toString()
        }
        log( `Adding daily stat: `, daily_stats_object )
        await db().collection( `daily_statistics` ).doc( `${ namespace }-${ day }` ).set( daily_stats_object, { merge: true } )

        log( `Updated` )

    } catch ( e ) {
        console.error( `Error updating counts: `, e )
    }

}
