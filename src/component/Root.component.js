import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'

import LogIn from './LogIn.component'
import Panel from '../container/panel.container';
import theme from '../theme'

const Root = ({ store }) => (
	<Provider store={ store }>
		<ThemeProvider theme={ theme }>
			<Router>
				<Redirect
					exact
					from="/" to="/panel/dashboard"
				/>
				<Route path="/panel" component={ Panel } />
				<Route path="/login:filter?" component={ LogIn } />
			</Router>
		</ThemeProvider>
	</Provider>
)

Root.propTypes = {
	store: PropTypes.object.isRequired
}

export default Root