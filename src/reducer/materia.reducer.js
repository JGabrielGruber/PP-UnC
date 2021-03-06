import { Materias } from '../model/materia.model'
import {
	REQUEST,
	RECEIVE,
	UPDATE
} from '../action/materia.action'

const materia = (
	state = {
		isFetching: false,
		didInvalidate: false,
		error: '',
		modified: false,
		materias: Materias()
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
					materias: action.items
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
				materias: action.items
			})
		default:
			return state
	}
}

export default materia