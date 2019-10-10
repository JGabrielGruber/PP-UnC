import axios from 'axios'

import { ProvasBases } from '../model/provaBase.model'

async function loadLocalProvasBases() {
	let provasBases = localStorage.getItem('provasBases')
	if (provasBases) {
		return JSON.parse(provasBases)
	} else {
		provasBases = ProvasBases()
		localStorage.setItem('provasBases', JSON.stringify(provasBases))
		return provasBases
	}
}

async function requestProvasBases(usuario_id, materia_id) {
	let axiosConf = {
		url: "usuarios/" + usuario_id + "/materias/" + materia_id + "/provas/"
	}
	let provasBases = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		if (!error.response.status) {
			return false
		}
		return error.response.status
	})
	if (isNaN(provasBases) && provasBases) {
		await provasBases.forEach(provaBase => {
			updateLocalProvaBase(provaBase)
		})
		return await loadLocalProvasBases()
	}
	return provasBases
}

async function updateLocalProvaBase(provaBase) {
	let provasBases = await loadLocalProvasBases()
	let index = provasBases.ids.indexOf(provaBase._id)
	if (index >= 0) {
		provasBases.provasBases[index] = provaBase
	} else {
		provasBases.provasBases.push(provaBase)
		provasBases.ids.push(provaBase._id)
	}
	localStorage.setItem('provasBases', JSON.stringify(provasBases))
	return provasBases
}

export { loadLocalProvasBases, updateLocalProvaBase, requestProvasBases }