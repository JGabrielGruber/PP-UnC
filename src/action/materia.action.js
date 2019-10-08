import {
	loadLocalMaterias,
	updateLocalMateria,
	requestMaterias as request
} from '../controller/materia.controller'

export const REQUEST = 'REQUEST_MATERIA'
export const RECEIVE = 'RECEIVE_MATERIA'
export const UPDATE = 'UPDATE_MATERIA'

const requestAction = () => ({
	type: REQUEST
})

const receiveAction = (status, materias) => ({
	type: RECEIVE,
	status: status,
	materias: materias
})

const updateAction = (materias) => ({
	type: UPDATE,
	materias: materias
})

function requestMaterias(usuario_id) {
	return async function (dispatch) {
		dispatch(requestAction())
		await loadLocalMaterias().then((materias) => {
			dispatch(receiveAction(true, materias))
		})
		dispatch(requestAction())
		request(usuario_id).then((materias) => {
			dispatch(receiveAction(materias ? true : false, materias ? materias : []))
		})
	}
}

function updateMateria(materia) {
	return function (dispatch) {
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