import axios from 'axios'

import Realizacao from '../model/realizacao.model'
import { isBoolean } from 'util';

function defineAxios(token) {
	axios.defaults.headers = {
		'AUTHORIZATION': "Bearer " + token
	}
}

async function loadLocalRealizacao() {
	let realizacao = localStorage.getItem('realizacao')
	if (realizacao) {
		realizacao = JSON.parse(realizacao)
		return realizacao
	}
	return false
}

async function updateLocalRealizacao(realizacao) {
	let local = await loadLocalRealizacao()
	localStorage.setItem('realizacao', JSON.stringify({
		...local,
		...realizacao
	}))
	return realizacao
}

async function requestDadosToken(token) {
	if (token) {
		let axiosConf = {
			url: "oauth/token/",
			method: "GET",
		}
	
		let data = await axios(axiosConf).then((response) => {
			return response.data;
		}).catch((error) => {
			if (error.response === undefined) {
				alert("Você está offline!")
			} else {
				alert(error.response.status)
			}
		})
		return updateLocalRealizacao({
			"acesso": data
		})
	}
	return false
}

async function requestDadosRealizacao(acesso) {
	if (acesso) {
		let axiosConf = {
			url: acesso.url_realizacao,
			method: "GET"
		}
		let data = await axios(axiosConf).then((response) => {
			return response.data;
		}).catch((error) => {
			if (error.response === undefined) {
				alert("Você está offline!")
			} else {
				alert(error.response.status)
			}
		})
		return updateLocalRealizacao({
			"realizacao": data
		})
	}
	return false
}

async function requestDadosProva(acesso) {
	if (acesso) {
		let axiosConf = {
			url: acesso.url_prova,
			method: "GET"
		}
	
		let data = await axios(axiosConf).then((response) => {
			return response.data;
		}).catch((error) => {
			if (error.response === undefined) {
				alert("Você está offline!")
			} else {
				alert(error.response.status)
			}
		})
		return updateLocalRealizacao({
			"prova": data
		})
	}
	return false
}

async function startRealizacao(acesso) {
	if (acesso) {
		let axiosConf = {
			url: acesso.url_realizacao + "/iniciar",
			method: "PUT"
		}
		
		let data = await axios(axiosConf).then((response) => {
			return response.data
		}).catch((error) => {
			if (error.response === undefined) {
				alert("Você está offline!")
			} else {
				alert(error.response.status)
			}
		})
		return updateLocalRealizacao({
			"realizacao": data
		})
	}
	return false
}

async function updateRealizacao(acesso, realizacao) {
	if (acesso) {
		let axiosConf = {
			url: acesso.url_realizacao,
			method: "PUT",
			data: {
				realizacao: {
					...realizacao,
					aluno: realizacao.aluno._id
				}
			}
		}
		
		let data = await axios(axiosConf).then((response) => {
			return response.data
		}).catch((error) => {
			if (error.response === undefined) {
				alert("Você está offline!")
			} else {
				alert(error.response.status)
			}
		})
		return updateLocalRealizacao({
			"realizacao": data
		})
	}
	return false
}

export {
	defineAxios,
	loadLocalRealizacao,
	updateLocalRealizacao,
	requestDadosProva,
	requestDadosRealizacao,
	requestDadosToken,
	startRealizacao,
	updateRealizacao
}