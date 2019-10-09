import {
	loadLocalUsuario,
	updateLocalUsuario,
	requestUsuario as request
} from '../controller/usuario.controller'
import {
	addMensagem,
	delMensagem
} from './mensagem.action'
import { number } from 'prop-types';

export const REQUEST	= 'REQUEST_USUARIO'
export const RECEIVE	= 'RECEIVE_USUARIO'
export const UPDATE		= 'UPDATE_USUARIO'

const requestAction = () => ({
	type: REQUEST
})

const receiveAction = (status, usuario) => ({
	type: RECEIVE,
	status: status,
	usuario: usuario
})

const updateAction = (usuario) => ({
	type: UPDATE,
	usuario: usuario
})

function requestUsuario() {
	return async function(dispatch, getState) {
		if (!getState().usuario.isFetching) {
			dispatch(requestAction())
			let id = await loadLocalUsuario().then((usuario) => {
				dispatch(receiveAction(true, usuario))
				return usuario._id
			})
			dispatch(requestAction())
			request(id).then((usuario) => {
				if (usuario && usuario !== number) {
					dispatch(receiveAction(true, usuario))
				} else {
					dispatch(receiveAction(false, {}))
					dispatch(addMensagem(usuario, "usuário"))
				}
			})
		}
	}
}

function updateUsuario(usuario) {
	return function(dispatch) {
		updateLocalUsuario(usuario)
		.then((usuario) => {
			dispatch(updateAction(usuario))
		})
	}
}

export {
	requestUsuario,
	updateUsuario
}