import { Alunos } from '../model/aluno.model'

const aluno = (
	state = {
		isFetching: false,
		didInvalidate: false,
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
					didInvalidate: true
				})
			}
		case 'UPDATE':
			return Object.assign({}, state, {
				modified: true,
				alunos: action.alunos
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

export default aluno