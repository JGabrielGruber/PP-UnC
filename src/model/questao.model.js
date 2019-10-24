const Questao = () => ({
	_id: '',
	numero: '',
	descricao: '',
	isAlternativa: false,
	alternativas: [],
	isMultipla: false,
	corretas: [],
	esperado: '',
	peso: ''
})

const Questoes = () => ({
	questoes: [],
	ids: []
})

export { Questao, Questoes }