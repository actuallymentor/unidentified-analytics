import Container from "../atoms/Container"
import Section from "../atoms/Section"
import { A, H1, H2, H3, Text } from "../atoms/Text"
import { lazy, Suspense } from "react"

import { generate } from 'random-words'
const Code = lazy( () => import( '../molecules/Code' ) )
const Recents = lazy( () => import( '../molecules/Recents' ) )
import { js_example, md_example, react_example, shell_example, unan_namespace } from "../../modules/code_examples"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../atoms/Button"
import Loading from "../molecules/Loading"

const SharedCodeLoading = <Loading delay="2000" minHeight="220px" message="Loading example" />

export default function Homepage() {

    const namespace = generate( 4 ).join( '-' )
    const navigate = useNavigate()

    useEffect( () => {
        fetch( `https://unidentifiedanalytics.web.app/touch/?namespace=${ unan_namespace }`, { mode: 'no-cors' } )
    }, [] )

    return <Container>

        <Section direction="row" justify="flex-start" align="flex-start" padding="5rem 0">
            
            <Section flex="2 1 400px" padding="1rem 2rem 0 0" align="flex-start">
                <H1>Unidentified Analytics</H1>
                <H2>The most basic tracking you have ever seen</H2>
                <Text margin='.5rem 0'>[GET] the endpoint /touch/?namespace=ANYTHING, and then see how many times and from how many ips that namespace was [GET] called.</Text>
                <Text margin='.5rem 0'>Useful for low-stakes analytics in hobby projects, from README.md files to command lines to webapps.</Text>
                <Button onClick={ () => navigate( `/stats/${ unan_namespace }` ) }>View example stats</Button>
            </Section>

            <Suspense fallback={ <Section align="flex-start" flex="1 0 200px"><H3>Recently viewed:</H3></Section> }>
                <Recents align="flex-start" flex="1 0 200px" />
            </Suspense>
        </Section>


        <Section align="flex-start">

            <H3>Track usage of a shell script</H3>
            <Suspense fallback={ SharedCodeLoading }>
                <Code language="bash" >
                    { shell_example( namespace ) }
                </Code>
            </Suspense>

            
        </Section>

        <Section align="flex-start">

            <H3>Track opens of a README.md (or webpage)</H3>
            <Suspense fallback={ SharedCodeLoading }>
                <Code language="markdown" >
                    { md_example( namespace ) }
                </Code>
            </Suspense>

            
        </Section>

        <Section align="flex-start">

            <H3>Track usage of javascript app</H3>
            <Suspense fallback={ SharedCodeLoading }>

                <Code language="javascript">
                    { js_example( namespace ) }
                </Code>
            </Suspense>

        </Section>

        <Section align="flex-start">

            <H3>React.js tracking used on this page:</H3>
            <Suspense fallback={ SharedCodeLoading }>
                <Code language="javascript">
                    { react_example( namespace ) }
                </Code>
            </Suspense>
            <Text justify='flex-start' direction="row">View stats at <A href={ `https://unidentifiedanalytics.web.app/stats/${ unan_namespace }` }>https://unidentifiedanalytics.web.app/stats/{ unan_namespace }</A></Text>

        </Section>

    </Container>
}