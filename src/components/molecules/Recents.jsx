import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useRecentNamespaces } from '../../hooks/namespace'
import { update_json_item_deletion } from '../../modules/local-storage'
import Section from '../atoms/Section'
import { A, H3 } from '../atoms/Text'

const Spacer = styled.span`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    align-items: center;

    & :first-child {
        max-width: 90%;
    }
    & :last-child {
        margin-left: auto;
    }
`

export default ( { ...props } ) => {

    const recents = useRecentNamespaces()
    const navigate = useNavigate()

    if( recents?.length ) return <Section { ...props }>
        <H3>Recently viewed:</H3>
        { recents.map( ( item, index ) => {
            const { namespace } = item
            return <Spacer key={ namespace }>
                <A margin='.5rem 0' onClick={ () => navigate( `/stats/${ namespace }` ) }>{ index + 1 }. { namespace }</A>
                <A margin=".5rem 0" onClick={ () => update_json_item_deletion( `recent_stat_visits`, namespace, true ) }>[x]</A>
            </Spacer>
        } ) }
    </Section>

}