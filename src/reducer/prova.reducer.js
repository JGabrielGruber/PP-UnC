import { Provas } from '../model/prova.model'

const prova = (
	state = {
		isFetching: false,
		didInvalidate: false,
		modified: false,
		provas: Provas()
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
					provas: action.provas
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
				provas: action.provas
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

export default prova