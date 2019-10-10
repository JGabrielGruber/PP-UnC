import axios from 'axios'

import { Turmas } from '../model/turma.model'

async function loadLocalTurmas() {
	let turmas = localStorage.getItem('turmas')
	if (turmas) {
		return JSON.parse(turmas)
	} else {
		turmas = Turmas()
		localStorage.setItem('turmas', JSON.stringify(turmas))
		return turmas
	}
}

async function requestTurmas(usuario_id, materia_id) {
	let axiosConf = {
		url: "usuarios/" + usuario_id + "/materias/" + materia_id + "/turmas/"
	}
	let turmas = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		
		if (!error.response.status) {
			return false
		}
		return error.response.status
	})
	if (isNaN(turmas) && turmas) {
		await turmas.forEach(turma => {
			updateLocalTurma(turma)
		})
		return await loadLocalTurmas()
	}
	return turmas
}

async function updateLocalTurma(turma) {
	let turmas = await loadLocalTurmas()
	let index = turmas.ids.indexOf(turma._id)
	if (index >= 0) {
		turmas.turmas[index] = turma
	} else {
		turmas.turmas.push(turma)
		turmas.ids.push(turma._id)
	}
	localStorage.setItem('turmas', JSON.stringify(turmas))
	return turmas
}

export { loadLocalTurmas, updateLocalTurma, requestTurmas }