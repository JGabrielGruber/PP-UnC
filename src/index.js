import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'

import * as serviceWorker from './serviceWorker';
import configureStore from './configureStore'
import Root from './component/Root.component'
import { url_api } from './conf'

const store = configureStore()
axios.defaults.baseURL = url_api

render(
	<Root store={store} />,
	document.getElementById('root')
)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();