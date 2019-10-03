import { Turmas } from '../model/turma.model'
import {
	REQUEST,
	RECEIVE,
	UPDATE
} from '../action/turma.action'

const turma = (
	state = {
		isFetching: false,
		didInvalidate: false,
		error: '',
		modified: false,
		turmas: Turmas()
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
					turmas: action.turmas
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
				turmas: action.turmas
			})
		default:
			return state
	}
}

export default turma