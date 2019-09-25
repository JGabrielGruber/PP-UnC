import axios from 'axios'

import { Materia, Materias } from '../model/materia.model'

async function requestMaterias() {
	let materias = localStorage.getItem('materias')
	if (materias) {
		return JSON.parse(materias)
	} else {
		materias = Materias()
		localStorage.setItem('materias', JSON.stringify(materias))
		return materias
	}
}

async function updateMateria(materia) {
	let materias = await requestMaterias()
	let index = materias.ids.indexOf(materia._id)
	if (index >= 0) {
		materias.materias[index] = materia
	} else {
		materia['_id'] = materias.materias.length ? materias.materias[materias.materias.length -1]._id + 100 : "1"
		materias.materias.push(materia)
		materias.ids.push(materia._id)
	}
	localStorage.setItem('materias', JSON.stringify(materias))
	return materias
}

export { requestMaterias, updateMateria }