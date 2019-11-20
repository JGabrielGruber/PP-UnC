import { Realizacoes } from '../model/realizacao.model'
import {
	REQUEST,
	RECEIVE,
	UPDATE
} from '../action/realizacao.action'

const realizacao = (
	state = {
		isFetching: false,
		didInvalidate: false,
		error: '',
		modified: false,
		realizacoes: Realizacoes()
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
					realizacoes: action.items
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
				realizacoes: action.items
			})
		default:
			return state
	}
}

export default realizacao