export const shell_example = namespace => `
# Choose a random namespace for your app
app_namespace="${ namespace }"

# Call the endpoint
curl "https://unidentifiedanalytics.web.app/touch/?namespace=$app_namespace"

# OR call the endpoint silently and in the background
nohup curl "https://unidentifiedanalytics.web.app/touch/?namespace=$app_namespace" > /dev/null 2>&1

# Stats at: https://unidentifiedanalytics.web.app/stats/${ namespace }
`.trim()

export const js_example = namespace => `
// Choose a random namespace for your app
const app_namespace="${ namespace }"

// Call the endpoint
await fetch( \`https://unidentifiedanalytics.web.app/touch/?namespace=$\{ app_namespace }\` )

// Stats at: https://unidentifiedanalytics.web.app/stats/${ namespace }
`.trim()

export const md_example = namespace => `
// Load the tracking url as an image on any markdown document
![Privacy friendly user statistics pixel](https://unidentifiedanalytics.web.app/touch/?namespace=${ namespace })

// Load the tracking url as an image on any page
<img style="display: none;" src="https://unidentifiedanalytics.web.app/touch/?namespace=${ namespace }" />

// Stats at: https://unidentifiedanalytics.web.app/stats/${ namespace }
`.trim()

export const react_example = namespace => `
import { useEffect } from 'react'

useEffect( () => {
    const namespace = "${ namespace }"
    fetch( \`https://unidentifiedanalytics.web.app/touch/?namespace=${ namespace }\`, { mode: 'no-cors' } )
}, [] )
`.trim()

export const unan_namespace = 'unidentified-analytics-website-data'