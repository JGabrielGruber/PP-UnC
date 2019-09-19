import { schema } from 'normalizr'

const Resposta = new schema.Entity('respostas', {
	_id: '',
	escolhas: [''],
	resposta: '',
	correta: false,
	meioCorreta: false,
	esperado: '',
	peso: ''
})

export default Resposta