import { log } from "./helpers"

// JS Spec only notifies other tabs by default
// see: https://stackoverflow.com/questions/35865481/storage-event-not-firing
const notify_current_tab = () => {
    window.dispatchEvent( new Event( `storage` ) )
}

const { localStorage: store } = window
export const set_item = ( name, content, verbose=false ) => {

    try {

        const stringified = JSON.stringify( content )
        store.setItem( name, stringified )
        if( verbose ) log( `Successfully set ${ name } to:`, stringified )
        notify_current_tab()
        return { content: false }

    } catch ( e ) {
        log( `Error storing item in localstorage: `, e )
        return { error: e.message }
    }

}

export const get_item = ( name, format='json', verbose=false ) => {

    try {

        let content = store.getItem( name )
        if( format == 'json' ) content = JSON.parse( content )
        else content = `${ content }`

        if( verbose ) log( `Successfully got ${ name } to:`, content )
        notify_current_tab()
        return { content }

    } catch ( e ) {
        log( `Error storing item in localstorage: `, e )
        return { error: e.message }
    }

}

export const update_json_item = ( name, new_content, verbose=false ) => {

    try {

        // Get old content, assume empty object if none
        const { content: old_content } = get_item( name ) || {}
        if( verbose ) log( `Successfully got ${ name } to update:`, old_content )

        const merged_content = { ...old_content, ...new_content }
        set_item( name, merged_content )
        if( verbose ) log( `Merged new content for  ${ name }`, merged_content )
        notify_current_tab()
        return { content: merged_content }

    } catch ( e ) {
        log( `Error updating item in localstorage: `, e )
        return { error: e.message }
    }

}

export const update_json_item_deletion = ( name, key, verbose=false ) => {

    try {

        // Get old content, assume empty object if none
        const { content: old_content } = get_item( name ) || {}
        if( verbose ) log( `Successfully got ${ name } to update:`, old_content )

        delete old_content[ key ]
        set_item( name, old_content )
        if( verbose ) log( `Merged ${ key } content deletion for  ${ name }`, old_content )
        notify_current_tab()
        return { content: old_content }

    } catch ( e ) {
        log( `Error updating item in localstorage: `, e )
        return { error: e.message }
    }

}

export const remove_item = key => {

    try {
        window.localStorage.removeItem( key )
        notify_current_tab()
    } catch ( e ) {
        log( `Error removing item from localstorage: `, e )
        return { error: e.message }
    }

}