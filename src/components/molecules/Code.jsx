import SyntaxHighlighter from 'react-syntax-highlighter'
import { solarizedDark, solarizedLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useTheme } from 'styled-components'

export default ( { ...props } ) => {

    const { is_dark } = useTheme()

    return <SyntaxHighlighter customStyle={ { width: '100%' } } { ...props } style={ is_dark ? solarizedDark : solarizedLight } showLineNumbers wrapLines  />

}