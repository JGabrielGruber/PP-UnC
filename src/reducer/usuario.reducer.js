import Usuario from '../model/usuario.model'

const usuario = (
	state = {
		isFetching: false,
		didInvalidate: false,
		error: '',
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
					didInvalidate: true,
					error: action.errror
				})
			}
		case 'UPDATE':
			return Object.assign({}, state, {
				modified: true,
				usuario: action.usuario
			})
		default:
			return state
	}
}

export default usuario