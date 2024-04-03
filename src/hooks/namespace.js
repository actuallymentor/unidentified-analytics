import { useEffect, useState } from "react"
import { get_historical_stats, listen_to_document } from "../modules/firebase"
import { log, setListenerAndReturnUnlistener } from "../modules/helpers"
import { get_item } from "../modules/local-storage"

const sort_by_updated_desc = ( one, two ) => {
    if( one.updated > two.updated ) return -1
    if( one.updated < two.updated ) return 1
    if( one.updated == two.updated ) return 0
}

const sort_by_updated_asc = ( one, two ) => {
    if( one.updated > two.updated ) return 1
    if( one.updated < two.updated ) return -1
    if( one.updated == two.updated ) return 0
}

export const useStatsOfNamespace= ( namespace ) => {

    const [ stats, set_stats ] = useState(  )

    useEffect( () => listen_to_document( `statistics`, `${ namespace }`.toLocaleLowerCase(), statistics => {
        if( !statistics ) return log( `Unable to read stats for ${ namespace }` )
        set_stats( statistics )
        log( `Loaded ${ namespace } stats: `, statistics )
    } ), [ namespace ] )

    return stats

}

export const useHistoricalStatsOfNamespace = ( namespace ) => {

    const [ cached_stats, set_cached_stats ] = useState(  )
    const [ stats, set_stats ] = useState()
    const [ source, set_source ] = useState( 'cache' )  

    useEffect( () => listen_to_document( `historical_stats`, namespace, cached_historical_data => {
        cached_historical_data?.history.sort( sort_by_updated_asc )
        if( !stats ) {
            log( `Setting ${ namespace } historical stat cache: `, cached_historical_data )
            set_cached_stats( cached_historical_data )
        }
    } ), [ namespace ] )

    useEffect( (  ) => {

        let cancelled = false;
    
        ( async () => {
    
            try {
    
                const { data: historical_stats } = await get_historical_stats( { namespace } )
                historical_stats.history.sort( sort_by_updated_asc )
                const cache_is_up_to_date = historical_stats?.updated == cached_stats?.updated
                if( cache_is_up_to_date ) log( `Cache is as recent as received stats, keeping cache: `, cached_stats )
                else log( `Cache out of date, setting updated historical data: `, historical_stats )
                if( cancelled || cache_is_up_to_date ) return
                set_stats( historical_stats )
    
            } catch ( e ) {
                log( `Error getting historical stats: `, e )
            } finally {
                set_source( 'live' )
            }
    
        } )( )
    
        return () => cancelled = true
    
    }, [ namespace ] )

    return {
        stats: stats || cached_stats,
        source
    }

}

export const useRecentNamespaces = ( max_amount=5 ) => {

    const [ recents, set_recents ] = useState(  )

    const update_recents = () => {
        const { content } = get_item( `recent_stat_visits` )
        if( !content ) return
        const array_of_recents = Object.keys( content ).map( namespace => ( {
            namespace,
            ...content[ namespace ]
        } ) ).sort( sort_by_updated_desc ).slice( 0, max_amount )
        set_recents( array_of_recents )
    }

    useEffect( () => {

        update_recents()
        return setListenerAndReturnUnlistener( window, 'storage', event => {
            update_recents()
        } )

        
    }, [] )

    return recents

}