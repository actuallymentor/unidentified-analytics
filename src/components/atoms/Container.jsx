import styled from 'styled-components'

export default styled.div`
	position: relative;
	overflow: hidden;
	display: flex;
    align-items: ${ ( { align='center' } ) => align };
    justify-content: ${ ( { justify='flex-start' } ) => justify };
	flex-direction: ${ ( { direction='column' } ) => direction };
	min-height: ${ ( { minHeight='100vh' } ) => minHeight };
	width: ${ ( { width='100%' } ) => width };
	padding:  0 max( 1rem, calc( 25vw - 8rem ) );
	box-sizing: border-box;
	background-color: ${ ( { theme } ) => theme.colors.backdrop };
	& * {
		box-sizing: border-box;
	}
`