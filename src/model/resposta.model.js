const Resposta = () => ({
	_id: '',
	questao: '',
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

export { Resposta, Respostas }