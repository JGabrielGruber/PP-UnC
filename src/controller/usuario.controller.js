import axios from 'axios'

import Usuario from '../model/usuario.model'


async function loadLocalUsuario() {
	let usuario = localStorage.getItem('usuario')
	if (usuario) {
		return JSON.parse(usuario)
	} else {
		usuario = Usuario()
		localStorage.setItem('usuario', JSON.stringify(usuario))
		return usuario
	}
}

async function requestUsuario(id_usuario) {
	let axiosConf = {
		url: "usuarios/" + id_usuario
	}
	let usuario = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		if (!error.status) {
			return false
		}
		return error.status
	})
	if (isNaN(usuario) && usuario) {
		return await updateLocalUsuario(usuario)
	}
	return usuario
}

async function updateLocalUsuario(usuario) {
	localStorage.setItem('usuario', JSON.stringify(usuario))
	return usuario
}

export { loadLocalUsuario, updateLocalUsuario, requestUsuario }