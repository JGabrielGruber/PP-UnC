

import {
	loadLocalMaterias,
	updateLocalMateria,
	requestMaterias as request
} from '../controller/materia.controller'
import {
	addMensagem
} from './mensagem.action'

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
	return async function (dispatch, getState) {
		if (shouldRequest(getState)) {
			dispatch(requestAction())
			await loadLocalMaterias().then((materias) => {
				dispatch(receiveAction(true, materias))
			})
			dispatch(requestAction())
			request(usuario_id).then((materias) => {
				if (materias && isNaN(materias)) {
					dispatch(receiveAction(true, materias))
				} else {
					dispatch(receiveAction(false, {}))
					dispatch(addMensagem(materias, "matéria"))
				}
			})
		}
	}
}

function shouldRequest(getState) {
	if (getState().materia.isFetching || getState().materia.modified) {
		return false
	} else {
		return true
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