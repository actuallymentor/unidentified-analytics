// Firebase interactors
import { initializeApp } from "firebase-admin/app"
import { getFirestore } from 'firebase-admin/firestore'

// Cached app getter
let app_cache = undefined
export const app = () => {
    if( !app_cache ) app_cache = initializeApp( )
    return app_cache
}

// Cached db getter
let db_cache = undefined
export const db = () => {
    if( !db_cache ) db_cache = getFirestore( app( ) )
    return db_cache
}

/**
 * Extracts data from a Firestore snapshot.
 * @param {Object} snapOfDocOrDocs - The snapshot of a document or documents.
 * @param {boolean} [withDocId=true] - Whether to include the document ID in the extracted data.
 * @returns {Object|Array} - The extracted data.
 */
export const dataFromSnap = ( snapOfDocOrDocs, withDocId=true ) => {
	
    // If these are multiple docs
    if( snapOfDocOrDocs.docs ) return snapOfDocOrDocs.docs.map( doc => ( { id: doc.id, ...doc.data( ) } ) )

    // If this is a single document
    return { ... withDocId && { id: snapOfDocOrDocs.id }, ...snapOfDocOrDocs.data()  }

}