import { Materias } from '../model/materia.model'

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
					materias: action.materias
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
				materias: action.materias
			})
		default:
			return state
	}
}

export default materia