# Unidentified Analytics

The most basic tracking you have ever seen:

- tracks amount of times a namespace was called and displays hits per ip address
- no cookies, no sessions, no user tracking
- no account creation, no login, no password

> `[GET]` the endpoint `/touch/?namespace=ANYTHING`, and then see how many times and from how many ips that namespace was `[GET]` called.

Useful for low-stakes analytics in hobby projects, from README.md files to command lines to webapps.

[Click here to open Unidentifiec Analytics](https://unidentifiedanalytics.web.app/).

## Example usage:

**Shell script:**

```bash
# Choose a random namespace for your app
app_namespace="make-something-up-anything-works"

# Call the endpoint
curl "https://unidentifiedanalytics.web.app/touch/?namespace=$app_namespace"

# OR call the endpoint silently and in the background
nohup curl "https://unidentifiedanalytics.web.app/touch/?namespace=$app_namespace" > /dev/null 2>&1

# Stats at: https://unidentifiedanalytics.web.app/stats/make-something-up-anything-works
```

**Markdown:**

```markdown
// Load the tracking url as an image on any markdown document
![Privacy friendly user statistics pixel](https://unidentifiedanalytics.web.app/touch/?make-something-up-anything-works)

// Load the tracking url as an image on any page
<img style="display: none;" src="https://unidentifiedanalytics.web.app/touch/?make-something-up-anything-works" />

// Stats at: https://unidentifiedanalytics.web.app/stats/make-something-up-anything-works
```

**Javascript:**

```javascript
// Choose a random namespace for your app
const app_namespace="make-something-up-anything-works"

// Call the endpoint
await fetch( `https://unidentifiedanalytics.web.app/touch/?namespace=${ app_namespace }` )

// Stats at: https://unidentifiedanalytics.web.app/stats/make-something-up-anything-works
```

**React:**

```js
import { useEffect } from 'react'

useEffect( () => {
    const namespace = 'make-something-up-anything-works'
    fetch( `https://unidentifiedanalytics.web.app/touch/?namespace=${namespace}`, { mode: 'no-cors' } )
}, [] )
``