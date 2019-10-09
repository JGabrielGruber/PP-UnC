import axios from 'axios'

import { Alunos } from '../model/aluno.model'
import { number } from 'prop-types';

async function loadLocalAlunos() {
	let alunos = localStorage.getItem('alunos')
	if (alunos) {
		return JSON.parse(alunos)
	} else {
		alunos = Alunos()
		localStorage.setItem('alunos', JSON.stringify(alunos))
		return alunos
	}
}

async function requestAlunos(usuario_id, materia_id, turma_id) {
	let axiosConf = {
		url: "usuarios/" + usuario_id + "/materias/" + materia_id + "/turmas/" + turma_id + "/alunos/"
	}
	let alunos = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		if (!error.status) {
			return false
		}
		return error.status
	})
	if (alunos !== number && alunos) {
		await alunos.forEach(aluno => {
			updateLocalAluno(aluno)
		})
		return await loadLocalAlunos()
	}
	return null
}

async function updateLocalAluno(aluno) {
	let alunos = await loadLocalAlunos()
	let index = alunos.ids.indexOf(aluno._id)
	if (index >= 0) {
		alunos.alunos[index] = aluno
	} else {
		alunos.alunos.push(aluno)
		alunos.ids.push(aluno._id)
	}
	localStorage.setItem('alunos', JSON.stringify(alunos))
	return alunos
}

export { loadLocalAlunos, updateLocalAluno, requestAlunos }