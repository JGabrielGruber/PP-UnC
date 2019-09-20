import Usuario from '../model/usuario.model'

const usuario = (
	state = {
		isFetching: false,
		didInvalidate: false,
		modified: false,
		usuario: Usuario()
	},
	action
) => {
	switch (action.type) {
		case 'REQUEST':
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			})
		case 'RECEIVE':
			if (action.status) {
				return Object.assign({}, state, {
					isFetching: false,
					didInvalidate: false,
					modified: false,
					usuario: action.usuario
				})
			} else {
				return Object.assign({}, state, {
					isFetching: false,
					didInvalidate: true
				})
			}
		case 'UPDATE':
			return Object.assign({}, state, {
				modified: true,
				usuario: action.usuario
			})
		case 'SEND':
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			})
		default:
			return state
	}
}

export default usuario