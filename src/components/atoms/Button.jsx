import styled from 'styled-components'

export default styled.a`
	padding:  .5rem 1rem;
	margin: ${ ( { margin='1rem 0' } ) => margin };
	border: 2px solid ${ ( { color='accent', theme } ) => theme.colors[ color ] || color };
	color: ${ ( { color='accent', theme } ) => theme.colors[ color ] || color };
	font-size: 1rem;
	text-decoration: none;
	background: none;
	border-radius: 5px;
	&:hover {
		cursor: pointer;
		opacity: .6;
	}
`