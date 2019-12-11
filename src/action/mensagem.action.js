export const ADD = 'ADD_MENSAGEM'
export const DEL = 'DEL_MENSAGEM'
export const STATUS = 'STATUS_MENSAGEM'

const addAction = (mensagem) => ({
	type: ADD,
	mensagem: mensagem
})

const delAction = (index) => ({
	type: DEL,
	index: index
})

const statusAction = (status) => ({
	type: STATUS,
	status: status
})

function addMensagem(statusCode, conteudo = "", mensagem = "") {
	return function (dispatch) {
		if (mensagem) {
			switch (statusCode) {
				case 200:
					dispatch(addAction({
						open: true,
						variant: 'success',
						message: `${mensagem}${conteudo.slice(-1) === 's' ?
							(conteudo.slice(-2) === 'es' ? 'as' : conteudo.slice(-2)) :
							(conteudo.slice(-1) === 'e' ? 'a' : conteudo.slice(-1))} ${conteudo} com sucesso`
					}))
					dispatch(statusAction(true))
					break
				case 201:
					dispatch(addAction({
						open: true,
						variant: 'success',
						message: `Adicionad${conteudo.slice(-1) === 's' ?
							(conteudo.slice(-2) === 'es' ? 'as' : conteudo.slice(-2)) :
							(conteudo.slice(-1) === 'e' ? 'a' : conteudo.slice(-1))} ${conteudo} com sucesso`
					}))
					dispatch(statusAction(true))
					break
				case 400:
					dispatch(addAction({
						open: true,
						variant: 'warning',
						message: `Requisição inválida`
					}))
					dispatch(statusAction(true))
					break
				case 403:
					dispatch(addAction({
						open: true,
						variant: 'error',
						message: `Você não tem permissão`
					}))
					dispatch(statusAction(true))
					break
				case 404:
					dispatch(addAction({
						open: true,
						variant: 'warning',
						message: `${conteudo.charAt(0).toUpperCase() + conteudo.slice(1)} não encontrad${conteudo.slice(-1) === 's' ?
							(conteudo.slice(-2) === 'es' ? 'as' : conteudo.slice(-2)) :
							(conteudo.slice(-1) === 'e' ? 'a' : conteudo.slice(-1))}`
					}))
					dispatch(statusAction(true))
					break
				case 500:
					dispatch(addAction({
						open: true,
						variant: 'error',
						message: `Problema com o servidor de dados`
					}))
					dispatch(statusAction(true))
					break
				case 502:
					dispatch(addAction({
						open: true,
						variant: 'error',
						message: `Problema com o banco de dados`
					}))
					dispatch(statusAction(true))
					break
				default:
					dispatch(statusAction(false))
					dispatch(addAction({
						open: true,
						variant: 'error',
						message: `Problema de conexão com o servidor de dados`
					}))
					break
			}
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