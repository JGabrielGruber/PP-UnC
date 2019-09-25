import {
	requestMaterias as requests,
	requestMateria as request,
	updateMateria as update
} from '../controller/materia.controller'

const requestAction = () => ({
	type: 'REQUEST'
})

const receiveAction = (status, materias) => ({
	type: 'RECEIVE',
	status: status,
	materias: materias
})

const updateAction = (materias) => ({
	type: 'UPDATE',
	materias: materias
})

function requestMaterias() {
	return function(dispatch) {
		dispatch(requestAction())
		requests()
		.then((materias) => {
			dispatch(receiveAction(true, materias))
		})
	}
}

function updateMateria(materia) {
	return function(dispatch) {
		update(materia)
		.then((materias) => {
			dispatch(updateAction(materias))
		})
	}
}

export {
	requestMaterias,
	updateMateria
}