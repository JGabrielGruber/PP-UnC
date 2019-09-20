import { Alunos } from '../model/aluno.model'

const aluno = (
	state = {
		isFetching: false,
		didInvalidate: false,
		error: '',
		modified: false,
		alunos: Alunos()
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
					alunos: action.alunos
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
				alunos: action.alunos
			})
		default:
			return state
	}
}

export default aluno