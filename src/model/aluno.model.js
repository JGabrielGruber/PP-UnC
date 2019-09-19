import { schema } from 'normalizr'

const Aluno = new schema.Entity('alunos', {
	_id: '',
	nome: '',
	email: '',
	timestamp: '',
	timeupdate: ''
})

export default Aluno