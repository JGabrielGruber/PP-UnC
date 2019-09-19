const Resposta = () => ({
	_id: '',
	escolhas: [],
	resposta: '',
	correta: false,
	meioCorreta: false,
	esperado: '',
	peso: ''
})

const Respostas = () => ({
	respostas: [],
	ids: []
})

export default { Resposta, Respostas }