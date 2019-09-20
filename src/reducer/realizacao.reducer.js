import Realizacoes from '../model/realizacao.model'

const realizacao = (
	state = {
		isFetching: false,
		didInvalidate: false,
		modified: false,
		realizacoes: Realizacoes()
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
					realizacoes: action.realizacoes
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
				realizacoes: action.realizacoes
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

export default realizacao