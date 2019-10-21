import { Provas } from '../model/prova.model'
import {
	REQUEST,
	RECEIVE,
	UPDATE
} from '../action/prova.action'

const prova = (
	state = {
		isFetching: false,
		didInvalidate: false,
		error: '',
		modified: false,
		provas: Provas()
	},
	action
) => {
	switch (action.type) {
		case REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			})
		case RECEIVE:
			if (action.status) {
				return Object.assign({}, state, {
					isFetching: false,
					didInvalidate: false,
					modified: false,
					provas: action.items
				})
			} else {
				return Object.assign({}, state, {
					isFetching: false,
					didInvalidate: true,
					error: action.errror
				})
			}
		case UPDATE:
			return Object.assign({}, state, {
				modified: true,
				provas: action.items
			})
		default:
			return state
	}
}

export default prova