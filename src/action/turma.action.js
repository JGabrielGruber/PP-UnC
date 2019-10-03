import {
	loadLocalTurmas,
	updateLocalTurma,
	requestTurmas as request
} from '../controller/turma.controller'

export const REQUEST	= 'REQUEST_TURMA'
export const RECEIVE	= 'RECEIVE_TURMA'
export const UPDATE		= 'UPDATE_TURMA'

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
	return function(dispatch) {
		dispatch(requestAction())
		loadLocalTurmas().then((turmas) => {
			dispatch(receiveAction(true, turmas))
		})
		dispatch(requestAction())
		request(usuario_id, materia_id).then((turmas) => {
			dispatch(receiveAction(turmas ? true : false, turmas ? turmas : []))
		})
	}
}

function updateTurma(turma) {
	return function(dispatch) {
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