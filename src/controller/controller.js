import axios from 'axios'

async function loadLocal(slug, Model) {
	let items = localStorage.getItem(slug)
	if (items) {
		return JSON.parse(items)
	} else {
		items = Model()
		localStorage.setItem(slug, JSON.stringify(items))
		return items
	}
}

async function request(url, slug, Model, method='GET', data=null, reducer=null) {
	let axiosConf = {}
	if (method === 'POST' || method === 'PUT') {
		let content = {}
		content[reducer] = data
		axiosConf = {
			url: url,
			method: method,
			data: content
		}
	} else {
		axiosConf = {
			url: url,
			method: method
		}
	}
	let response = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		if (error.response === undefined) {
			return false
		}
		return error.response.status
	})
	if ((isNaN(response) && response) || Array.isArray(response)) {
		if (Array.isArray(response)) {
			for (let item of response) {
				await updateLocal(item, slug, Model)
			}
		} else {
			await updateLocal(response, slug, Model)
		}
		return await loadLocal(slug, Model)
	} else if (response == null) {
		await updateLocal(data, slug, Model, true)
		return await loadLocal(slug, Model)
	}
	return response
}

async function updateLocal(item, slug, Model, remove=false) {
	let items = await loadLocal(slug, Model)
	let index = items.ids.indexOf(item._id)
	if (index >= 0) {
		if (!remove) {
			items[slug][index] = item
		} else {
			items[slug].pop(index)
			items.ids.pop(index)
		}
	} else {
		items[slug].push(item)
		items.ids.push(item._id)
	}
	await localStorage.setItem(slug, JSON.stringify(items))
	return items
}

export { loadLocal, request, updateLocal }