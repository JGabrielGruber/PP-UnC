import { ProvasBases } from '../model/provaBase.model'

const provaBase = (
	state = {
		isFetching: false,
		didInvalidate: false,
		error: '',
		modified: false,
		provasBases: ProvasBases()
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
					provasBases: action.provasBases
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
				provasBases: action.provasBases
			})
		default:
			return state
	}
}

export default provaBase