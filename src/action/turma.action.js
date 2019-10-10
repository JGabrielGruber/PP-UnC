import {
	loadLocalTurmas,
	updateLocalTurma,
	requestTurmas as request
} from '../controller/turma.controller'
import { addMensagem } from './mensagem.action';


export const REQUEST = 'REQUEST_TURMA'
export const RECEIVE = 'RECEIVE_TURMA'
export const UPDATE = 'UPDATE_TURMA'

const requestAction = () => ({
	type: REQUEST
})

const receiveAction = (status, turmas) => ({
	type: RECEIVE,
	status: status,
	turmas: turmas
})

const updateAction = (turmas) => ({
	type: UPDATE,
	turmas: turmas
})

function requestTurmas(usuario_id, materia_id) {
	return async function (dispatch, getState) {
		if (!getState().turma.isFetching) {
			dispatch(requestAction())
			await loadLocalTurmas().then((turmas) => {
				dispatch(receiveAction(true, turmas))
			})
			dispatch(requestAction())
			request(usuario_id, materia_id).then((turmas) => {
				if (turmas && isNaN(turmas)) {
					dispatch(receiveAction(true, turmas))
				} else {
					dispatch(receiveAction(false, {}))
					dispatch(addMensagem(turmas, "turmas"))
				}
			})
		}
	}
}

function updateTurma(turma) {
	return function (dispatch) {
		updateLocalTurma(turma)
			.then((turmas) => {
				dispatch(updateAction(turmas))
			})
	}
}

export {
	requestTurmas,
	updateTurma
}