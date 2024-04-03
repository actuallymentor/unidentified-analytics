import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Theme from './components/atoms/Theme'
import Homepage from './components/pages/Homepage'
import Loading from './components/molecules/Loading'
const Stats = lazy( () => import( './components/pages/Stats' ) )

// ///////////////////////////////
// Render component
// ///////////////////////////////
export default function App( ) {

    return <Theme>

        <Suspense fallback={ <Loading delay="500" message='Loading' /> }>

            <Router>

                <Routes>

                    <Route exact path='/' element={ <Homepage /> } />
                    <Route exact path='/stats/:namespace' element={ <Stats /> } />

                </Routes>


            </Router>

        </Suspense>


    </Theme>

}