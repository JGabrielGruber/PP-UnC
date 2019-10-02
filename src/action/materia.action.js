import {
	loadLocalMaterias,
	updateLocalMateria,
	requestMaterias as request
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
		loadLocalMaterias().then((materias) => {
			console.log(materias);
			
			dispatch(receiveAction(true, materias))
		})
		dispatch(requestAction())
		request().then((materias) => {
			console.log(materias);
			
			dispatch(receiveAction(materias ? true : false, { "materias": materias } ? materias : []))
		})
	}
}

function updateMateria(materia) {
	return function(dispatch) {
		updateLocalMateria(materia)
		.then((materias) => {
			dispatch(updateAction(materias))
		})
	}
}

export {
	requestMaterias,
	updateMateria
}