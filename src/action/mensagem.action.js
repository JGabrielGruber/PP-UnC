export const ADD = 'ADD_MENSAGEM'
export const DEL = 'DEL_MENSAGEM'

const addAction = (mensagem) => ({
	type: ADD,
	mensagem: mensagem
})

const delAction = (index) => ({
	type: DEL,
	index: index
})

function addMensagem(statusCode, conteudo = "") {
	return function (dispatch) {
		switch (statusCode) {
			case 201:
				dispatch(addAction({
					open: true,
					variant: 'success',
					message: `Adicionado${conteudo.slice(-1) === 's' ?
						(conteudo.slice(-2) === 'es' ? 'as' : conteudo.slice(-2)) :
						(conteudo.slice(-1) === 'e' ? 'a' : conteudo.slice(-1))} ${conteudo} com sucesso`
				}))
				break
			case 403:
				dispatch(addAction({
					open: true,
					variant: 'error',
					message: `Você não tem permissão`
				}))
				break
			case 404:
				dispatch(addAction({
					open: true,
					variant: 'warning',
					message: `${conteudo.charAt(0).toUpperCase() + conteudo.slice(1)} não encontrad${conteudo.slice(-1) === 's' ?
						(conteudo.slice(-2) === 'es' ? 'as' : conteudo.slice(-2)) :
						(conteudo.slice(-1) === 'e' ? 'a' : conteudo.slice(-1))}`
				}))
				break
			case 500:
				dispatch(addAction({
					open: true,
					variant: 'error',
					message: `Problema com o servidor de dados`
				}))
				break
			case 502:
				dispatch(addAction({
					open: true,
					variant: 'error',
					message: `Problema com o banco de dados`
				}))
				break
			default:
				dispatch(addAction({
					open: true,
					variant: 'error',
					message: `Problema de conexão com o servidor de dados`
				}))
				break
		}
	}
}

function delMensagem(index) {
	return function (dispatch) {
		dispatch(delAction(index))
	}
}

export {
	addMensagem,
	delMensagem
}