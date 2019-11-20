const Realizacao = () => ({
	_id: '',
	aluno: {},
	respostas: [],
	iniciada: false,
	finalizada: false,
	limite: null,
	total: '',
	timestarted: '',
	timestamp: '',
	timeupdate: ''
})

const Realizacoes = () => ({
	realizacoes: [],
	ids: []
})

export { Realizacao, Realizacoes }