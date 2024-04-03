import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { H1, H2, Sidenote, Text } from "../atoms/Text"
import { useParams } from "react-router-dom"
import { useHistoricalStatsOfNamespace, useStatsOfNamespace } from "../../hooks/namespace"
import { capitalise, log } from "../../modules/helpers"
import { useEffect } from "react"
import { update_json_item } from "../../modules/local-storage"

import { lazy, Suspense } from "react"
const HistoryChart = lazy( () => import( "../molecules/HistoryChart" ) )
import { Spinner } from "../molecules/Loading"

export default function Stats() {

    const { namespace } = useParams()
    const stats = useStatsOfNamespace( namespace )
    const { stats: historical_stats, source } = useHistoricalStatsOfNamespace( namespace )
    
    useEffect( () => {
        document.title = `${ capitalise( namespace ) }'s Unidentified Analytics`
        update_json_item( `recent_stat_visits`, {
            [namespace]: {
                updated: Date.now(), updated_human: new Date().toString()
            }
        } )
    }, [ namespace ] )

    return <Container justify='center' align='flex-start'>

        <Section direction='row'>
        
            <Section align='flex-start' width='400px'>
                <H1 margin='0'>Unidentified Analytics</H1>
                <H2>{ capitalise( namespace ) }</H2>
                <Text margin='0'>{ stats?.unique_ips || 'Unknown' } total unique ips</Text>
                <Text margin='0'>{ stats?.touches || 'Unknown' } total touches</Text>
                <Sidenote margin='2rem 0 0'>Last: { stats?.updated ? new Date( stats?.updated ).toString() : 'unknown' }</Sidenote>
            </Section>

            <Section style={ { flex: 1 } }>

                <Suspense fallback={ <Spinner /> }>
                    { historical_stats && <HistoryChart historical_stats={ historical_stats } /> }
                    { source == 'cache' && <Sidenote>
                        <Spinner margin="0 .5rem 0" size={ 10 } />
                        Updating historical data...
                    </Sidenote>}
                </Suspense>


            </Section>
        </Section>

    </Container>
}