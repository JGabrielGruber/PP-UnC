import {
	loadLocalProvas,
	updateLocalProva,
	requestProvas as request
} from '../controller/prova.controller'
import { number } from 'prop-types';
import { addMensagem } from './mensagem.action';

export const REQUEST	= 'REQUEST_PROVA'
export const RECEIVE	= 'RECEIVE_PROVA'
export const UPDATE		= 'UPDATE_PROVA'

const requestAction = () => ({
	type: REQUEST
})

const receiveAction = (status, provas) => ({
	type: RECEIVE,
	status: status,
	provas: provas
})

const updateAction = (provas) => ({
	type: UPDATE,
	provas: provas
})

function requestProvas(usuario_id, materia_id, turma_id) {
	return function(dispatch) {
		dispatch(requestAction())
		loadLocalProvas().then((provas) => {
			dispatch(receiveAction(true, provas))
		})
		dispatch(requestAction())
		request(usuario_id, materia_id, turma_id).then((provas) => {
			if (provas && provas !== number) {
				dispatch(receiveAction(true, provas))
			} else {
				dispatch(receiveAction(false, {}))
				dispatch(addMensagem(provas, "provas"))
			}
		})
	}
}

function updateProva(prova) {
	return function(dispatch) {
		updateLocalProva(prova)
		.then((provas) => {
			dispatch(updateAction(provas))
		})
	}
}

export {
	requestProvas,
	updateProva
}