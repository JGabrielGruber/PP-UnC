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

async function request(url, slug, Model) {
	let axiosConf = {
		url: url
	}
	let items = await axios(axiosConf).then((response) => {
		return response.data
	}).catch((error) => {
		if (!error.response && !error.response.status) {
			return false
		}
		return error.response.status
	})
	
	if (isNaN(items) && items) {
		await items.forEach(item => {
			updateLocal(item, slug, Model)
		})
		return await loadLocal(slug, Model)
	}
	return items
}

async function updateLocal(item, slug, Model) {
	let items = await loadLocal(slug, Model)
	let index = items.ids.indexOf(item._id)
	if (index >= 0) {
		items.items[index] = item
	} else {
		items.items.push(item)
		items.ids.push(item._id)
	}
	localStorage.setItem(slug, JSON.stringify(items))
	return items
}

export { loadLocal, request, updateLocal }