import axios from 'axios'

import { Materias } from '../model/materia.model'
import { number } from 'prop-types';

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

async function requestMaterias(usuario_id) {
	let axiosConf = {
		url: "usuarios/" + usuario_id + "/materias/"
	}
	let materias = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		if (!error.status) {
			return false
		}
		return error.status
	})
	
	if (materias !== number && materias) {
		await materias.forEach(materia => {
			updateLocalMateria(materia)
		})
		return await loadLocalMaterias()
	}
	return materias
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