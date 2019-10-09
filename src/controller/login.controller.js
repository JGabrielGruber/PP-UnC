import axios from 'axios'

import Usuario from '../model/usuario.model'
import { updateLocalUsuario } from './usuario.controller'
import { number, bool } from 'prop-types';

function defineAxios(token) {
	axios.defaults.headers = {
		'AUTHORIZATION': token
	}
}

async function loadLocalLogin() {
	let login = localStorage.getItem('login')
	if (login) {
		login = JSON.parse(login)
		defineAxios(login.token)
		return login
	}
	return false
}

async function updateLocalLogin(login) {
	localStorage.setItem('login', JSON.stringify(login))
	return login
}

async function requestToken(client_id, client_secret, keep = true, grant_type = "client_credentials") {
	let axiosConf = {
		url: "oauth/token/",
		method: "POST",
		data: {
			grant_type,
			client_id,
			client_secret
		}
	}
	let data = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		if (!error.status) {
			return false
		}
		return error.status
	})
	if (data === number || data === bool) {
		return data
	}
	let login = {
		"access_token": data.access_token,
		"token_type": data.token_type,
		"token": data.token_type.substr(0, 1).toUpperCase() + data.token_type.substr(1) + " " + data.access_token
	}
	defineAxios(login.token)
	if (keep) {
		return await updateLocalLogin(login)
	}
	return login
}

async function requestId() {
	let axiosConf = {
		url: "oauth/token/",
		method: "GET"
	}
	let data = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		console.log(error.response)
		return false
	})
	if (!data) {
		return false
	}
	let usuario = Usuario()
	usuario._id	= data.client_id
	return await updateLocalUsuario(usuario)
}

export { loadLocalLogin, updateLocalLogin, requestToken, requestId }