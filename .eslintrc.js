const { eslint_config } = require('@poap/skunk-linter')

// Export the default eslint config
module.exports = {
    ...eslint_config,
    plugins: [ 'unused-imports' ],
    rules: {
        ...eslint_config.rules,
        "react/no-unescaped-entities": 0,
        "unused-imports/no-unused-imports": "warn",
    }
}
