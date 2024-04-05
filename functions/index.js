// Firebase dependencies
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { v2_oncall } from './runtime/on_call_runtimes.mjs'
import { v2_onrequest } from './runtime/on_request_runtimes.mjs'

// Touch registration
import { register_touch as _register_touch } from './modules/touch.mjs'
export const register_touch = v2_onrequest( [ 'max_concurrency' ], _register_touch )

// Touch collation
import { collate_touch_count as _collate_touch_count } from './modules/touch.mjs'
export const collate_touch_count = onDocumentCreated( 'hashed_touches/{touch_id}', _collate_touch_count )

// Historical stats
import { get_historical_stats as _get_historical_stats } from './modules/statistics.mjs'
export const get_historical_stats = v2_oncall( _get_historical_stats )

// Migrate IP data
// import { migrate_ip_data_to_hashed_data as _migrate_ip_data_to_hashed_data } from './modules/statistics.mjs'
// export const migrate_ip_data_to_hashed_data = v2_onrequest( [ 'long_timeout' ], _migrate_ip_data_to_hashed_data )