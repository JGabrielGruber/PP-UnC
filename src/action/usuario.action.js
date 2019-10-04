import {
	loadLocalUsuario,
	updateLocalUsuario,
	requestUsuario as request
} from '../controller/usuario.controller'

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
				dispatch(receiveAction(usuario ? true : false, { "usuario": usuario } ? usuario : []))
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