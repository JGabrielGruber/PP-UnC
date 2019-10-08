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
			mensagens = state.mensagens
			mensagens.push(action.mensagem)
			return Object.assign({}, state, mensagens)
		case DEL:
			mensagens = state.mensagens
			mensagens.pop(action.mensagem)
			return Object.assign({}, state, mensagens)
		default:
			return state
	}
}

export default mensagem