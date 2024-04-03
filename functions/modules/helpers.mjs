export const dev = !!process.env.development

/**
 * Logs the provided comments to the console if the `dev` flag is set or the `VERBOSE` environment variable is truthy.
 * @param {...any} comments - The comments to be logged.
 */
export const log = ( ...comments ) => {
    if( dev || process.env.VERBOSE ) console.log( ...comments )
}

/**
 * Waits for a specified duration before resolving the promise.
 *
 * @param {number} [durationinMs=1000] - The duration to wait in milliseconds.
 * @returns {Promise<void>} - A promise that resolves after the specified duration.
 */
export const wait = ( durationinMs=1000 ) => new Promise( resolve => setTimeout( resolve, durationinMs ) )

/**
 * Returns the current date in the format YYYY-MM-DD.
 * @returns {string} The current date in the format YYYY-MM-DD.
 */
export const YYYY_MM_DD = () => new Date().toISOString().split( 'T' )[0]

/**
 * Returns the number of milliseconds in a day.
 *
 * @returns {number} The number of milliseconds in a day.
 */
export const day_in_ms = () => new Date( YYYY_MM_DD() ).getTime()

