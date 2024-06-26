import styled from 'styled-components'

export const Text = styled.p`
	font-size: 1rem;
	margin: ${ ( { margin='1rem 0' } ) => margin };
	line-height: 1.5rem;
	color: ${ ( { theme, color } ) => color || theme.colors.text };
	text-align: ${ ( { align } ) => align || 'left' };
	overflow-wrap: anywhere;
	background: ${ ( { background='initial' } ) => background };
	display: flex;
	flex-direction: ${ ( { direction } ) => direction || 'column' };
	align-items: ${ ( { align } ) => align || 'center' };
	justify-content: ${ ( { justify } ) => justify || 'center' };
`

export const H1 = styled.h1`
	font-size: 2.5rem;
	font-weight: 500;
	line-height: 1.2;
	margin: ${ ( { margin='0 0 1rem 0' } ) => margin };
	font-family: Helvetica, sans-serif;
	text-align: ${ ( { align } ) => align || 'left' };
	color: ${ ( { theme, color } ) => color || theme.colors.primary };
	overflow-wrap: anywhere;
`

export const H2 = styled.h2`
	font-size: 1.5rem;
	margin: 0 0 1rem;
	line-height: 1.2;
	font-weight: 400;
	text-align: ${ ( { align } ) => align || 'left' };
	color: ${ ( { theme, color } ) => color || theme.colors.accent };
	overflow-wrap: anywhere;
`

export const H3 = styled.h3`
	font-size: 1.2rem;
	margin: 0 0 1rem;
	line-height: 1.2;
	font-weight: 400;
	text-align: ${ ( { align } ) => align || 'left' };
	color: ${ ( { theme, color } ) => color || theme.colors.primary };
	overflow-wrap: anywhere;
`

export const A = styled.a`
	margin: ${ ( { margin='0 0 0 .25rem' } ) => margin };
	color: ${ ( { theme, color } ) => color || theme.colors.accent };
	&:hover {
		cursor: pointer;
	}
`

export const Sidenote = styled.p`
	color: ${ ( { theme } ) => theme.colors.hint };
	font-style: italic;
	margin: ${ ( { margin='1rem 0' } ) => margin };
	text-align: left;
	overflow-wrap: anywhere;
	font-size: ${ ( { size='.7rem' } ) => size };
	display: flex;
	align-items: center;
	justify-content: ${ ( { justify='flex-start' } ) => justify };
`

export const Br = styled.span`
	width: 100%;
	margin: 2rem 0;
`
export const Sup = styled.sup`
	overflow-wrap: anywhere;
`