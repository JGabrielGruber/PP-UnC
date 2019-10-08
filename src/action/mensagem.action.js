export const ADD = 'ADD_MENSAGEM'
export const DEL = 'DEL_MENSAGEM'

const addAction = (mensagem) => ({
	type: ADD,
	mensagem: mensagem
})

const delAction = (mensagem) => ({
	type: DEL,
	mensagem: mensagem
})

function addMensagem(statusCode, conteudo = "") {
	return function (dispatch) {
		switch (statusCode) {
			case 201:
				dispatch(addAction({
					open: true,
					variant: 'success',
					message: `Adicionado(a) ${conteudo} com sucesso`
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
					message: `${conteudo} não encontrado(a)`
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
				break
		}
	}
}

function delMensagem(mensagem) {
	return function(dispatch) {
		dispatch(delAction(mensagem))
	}
}

export {
	addMensagem,
	delMensagem
}