// Firebase functionality
import { initializeApp } from "firebase/app"
import { getFirestore, doc, onSnapshot } from "firebase/firestore"
import { getAnalytics, logEvent } from "firebase/analytics"
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaEnterpriseProvider, ReCaptchaV3Provider } from 'firebase/app-check'

import { log } from './helpers'

// ///////////////////////////////
// Initialisation
// ///////////////////////////////

// Firebase config
const { VITE_apiKey, VITE_authDomain, VITE_projectId, VITE_storageBucket, VITE_messagingSenderId, VITE_appId, VITE_measurementId, VITE_recaptcha_site_key, VITE_recaptcha_enterprise_site_key, VITE_APPCHECK_DEBUG_TOKEN } = import.meta.env
const config = {
    apiKey: VITE_apiKey,
    authDomain: VITE_authDomain,
    projectId: VITE_projectId,
    storageBucket: VITE_storageBucket,
    messagingSenderId: VITE_messagingSenderId,
    appId: VITE_appId,
    measurementId: VITE_measurementId
}

log( 'Init firebase with ', config )

// Cached app instance
let app_cache = null
const app = () => {
    if( !app_cache ) app_cache = initializeApp( config )
    return app_cache
}
const analytics = getAnalytics( app() )
const functions = getFunctions( app() )

// Cached db instance
let db_cache = null
const db = () => {
    if( !db_cache ) db_cache = getFirestore( app )
    return db_cache
}

// App check config
if( import.meta.env.NODE_ENV === 'development' || VITE_APPCHECK_DEBUG_TOKEN ) self.FIREBASE_APPCHECK_DEBUG_TOKEN = VITE_APPCHECK_DEBUG_TOKEN || true
log( 'Initialising app check with ', { VITE_APPCHECK_DEBUG_TOKEN, VITE_recaptcha_site_key, VITE_recaptcha_enterprise_site_key } )
const appcheck = initializeAppCheck( app(), {
    ...VITE_recaptcha_site_key && { provider: new ReCaptchaV3Provider( VITE_recaptcha_site_key ) },
    ...VITE_recaptcha_enterprise_site_key && { provider: new ReCaptchaEnterpriseProvider( VITE_recaptcha_enterprise_site_key ) },
    isTokenAutoRefreshEnabled: true
} )

// Remote functions
export const get_historical_stats = httpsCallable( functions, 'get_historical_stats' )

// Connect to functions emulator
if( import.meta.env.VITE_useEmulator ) {
    connectFunctionsEmulator( functions, 'localhost', 5001 )
    log( `Using firebase functions emulator` )
}


/**
* Listen to a firestore document path
* @param {String} collection - The name of the collection
* @param {String} document - The path of the document within the given collection
* @param {Function} callback - The callback that receives the changed value of the document
* @returns {Function} Unsubscribe listener 
*/
export function listen_to_document( collection, document, callback, verbose=false ) {

    const d = doc( db(), collection, document )
    if( verbose ) log( `Setting listener on ${ collection }/${ document }` )
    return onSnapshot( d, snap => {

        const data = snap.data()
        if( verbose ) log( `Retreived document ${ collection }/${ document }: `, data )
        callback( data )

    } )

}

// ///////////////////////////////
// Analytics actions
// ///////////////////////////////
export function track_event( name ) {
    if( !name ) return
    if( import.meta.env.NODE_ENV == 'development' ) return log( 'Dummy analytics event: ', name )
    logEvent( analytics, name )
}