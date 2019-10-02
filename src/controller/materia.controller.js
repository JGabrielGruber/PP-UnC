import axios from 'axios'

import { Materia, Materias } from '../model/materia.model'

async function loadLocalMaterias() {
	let materias = localStorage.getItem('materias')
	if (materias) {
		return JSON.parse(materias)
	} else {
		materias = Materias()
		localStorage.setItem('materias', JSON.stringify(materias))
		return materias
	}
}

async function requestMaterias(id) {
	let axiosConf = {
		url: "usuarios/5d764977386c205a246c2c29/materias/"
	}
	let materias = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		console.log(error.response)
		return false
	})
	materias.forEach(materia => {
		updateLocalMateria(materia)
	});
	return await loadLocalMaterias()
}

async function updateLocalMateria(materia) {
	let materias = await loadLocalMaterias()
	let index = materias.ids.indexOf(materia._id)
	if (index >= 0) {
		materias.materias[index] = materia
	} else {
		materias.materias.push(materia)
		materias.ids.push(materia._id)
	}
	localStorage.setItem('materias', JSON.stringify(materias))
	return materias
}

export { loadLocalMaterias, updateLocalMateria, requestMaterias }