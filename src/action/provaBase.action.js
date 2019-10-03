import {
	loadLocalProvasBases,
	updateLocalProvaBase,
	requestProvasBases as request
} from '../controller/provaBase.controller'

export const REQUEST	= 'REQUEST_PROVABASE'
export const RECEIVE	= 'RECEIVE_PROVABASE'
export const UPDATE		= 'UPDATE_PROVABASE'

const requestAction = () => ({
	type: REQUEST
})

const receiveAction = (status, provasBases) => ({
	type: RECEIVE,
	status: status,
	provasBases: provasBases
})

const updateAction = (provasBases) => ({
	type: UPDATE,
	provasBases: provasBases
})

function requestProvasBases(usuario_id, materia_id) {
	return function(dispatch) {
		dispatch(requestAction())
		loadLocalProvasBases().then((provasBases) => {
			dispatch(receiveAction(true, provasBases))
		})
		dispatch(requestAction())
		request(usuario_id, materia_id).then((provasBases) => {
			dispatch(receiveAction(provasBases ? true : false, provasBases ? provasBases : []))
		})
	}
}

function updateProvaBase(provaBase) {
	return function(dispatch) {
		updateLocalProvaBase(provaBase)
		.then((provasBases) => {
			dispatch(updateAction(provasBases))
		})
	}
}

export {
	requestProvasBases,
	updateProvaBase
}