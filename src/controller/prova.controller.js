import axios from 'axios'

import { Provas } from '../model/prova.model'


async function loadLocalProvas() {
	let provas = localStorage.getItem('provas')
	if (provas) {
		return JSON.parse(provas)
	} else {
		provas = Provas()
		localStorage.setItem('provas', JSON.stringify(provas))
		return provas
	}
}

async function requestProvas(usuario_id, materia_id, turma_id) {
	let axiosConf = {
		url: "usuarios/" + usuario_id + "/materias/" + materia_id + "/turmas/" + turma_id + "/provas/"
	}
	let provas = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		if (!error.response.status) {
			return false
		}
		return error.response.status
	})
	if (provas !== number && provas) {
		await provas.forEach(prova => {
			updateLocalProva(prova)
		})
		return await loadLocalProvas()
	}
	return null
}

async function updateLocalProva(prova) {
	let provas = await loadLocalProvas()
	let index = provas.ids.indexOf(prova._id)
	if (index >= 0) {
		provas.provas[index] = prova
	} else {
		provas.provas.push(prova)
		provas.ids.push(prova._id)
	}
	localStorage.setItem('provas', JSON.stringify(provas))
	return provas
}

export { loadLocalProvas, updateLocalProva, requestProvas }