import {
	ADD,
	DEL
} from '../action/mensagem.action'

const mensagem = (
	state = {
		mensagens: []
	},
	action
) => {
	let mensagens
	switch (action.type) {
		case ADD:
			mensagens = state.mensagens.slice()
			mensagens.splice(state.mensagens.length, 0, action.mensagem)
			return Object.assign({}, state, { mensagens: mensagens })
		case DEL:
			mensagens = state.mensagens.slice()
			mensagens.splice(action.index, 1)
			return Object.assign({}, state, { mensagens: mensagens })
		default:
			return state
	}
}

export default mensagem