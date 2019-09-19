import { schema } from 'normalizr'

const Questao = new schema.Entity('questoes', {
	_id: '',
	descricao: '',
	isAlternativa: false,
	alternativas: [''],
	isMultipla: false,
	corretas: [''],
	esperado: '',
	peso: ''
})

export default Questao