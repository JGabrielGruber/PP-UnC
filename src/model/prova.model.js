import { schema } from 'normalizr'

import Questao from './questao.model'
import Realizacao from './realizacao.model'

const Prova = new schema.Entity('provas', {
	_id: '',
	titulo: '',
	descricao: '',
	duracao: '',
	questoes: [Questao],
	realizacoes: [Realizacao],
	timestamp: '',
	timeupdate: ''
})

export default Prova