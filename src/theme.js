import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
	palette: {
		primary: {
			// light: will be calculated from palette.primary.main,
			main: '#1B50BD',
			// dark: will be calculated from palette.primary.main,
			// contrastText: will be calculated to contrast with palette.primary.main
		},
		secondary: {
			//light: '#0066ff',
			main: '#B2B2B2',
			// dark: will be calculated from palette.secondary.main,
			contrastText: '#ffcc00',
		},
		// error: will use the default color
	},
	overrides: {
		MuiButton: {
			containedPrimary: {
				background: 'linear-gradient(to right, #0E2580, #297CFB)'
			}
		},
		MuiBadge: {
			colorSecondary: {
				color: '#FFF'
			}
		}
	}
})

export default theme