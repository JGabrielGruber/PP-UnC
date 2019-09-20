import { Cursos } from '../model/curso.model'

const curso = (
	state = {
		isFetching: false,
		didInvalidate: false,
		error: '',
		modified: false,
		cursos: Cursos()
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
					cursos: action.cursos
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
				cursos: action.cursos
			})
		default:
			return state
	}
}

export default curso