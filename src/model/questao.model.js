const Questao = () => ({
	_id: '',
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