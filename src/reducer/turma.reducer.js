import Turmas from '../model/turma.model'

const turma = (
	state = {
		isFetching: false,
		didInvalidate: false,
		modified: false,
		turmas: Turmas()
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
					turmas: action.turmas
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
				turmas: action.turmas
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

export default turma