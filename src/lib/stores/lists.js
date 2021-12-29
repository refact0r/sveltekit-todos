import { writable } from 'svelte/store'

export let lists = writable()

export async function loadLists() {
	console.log('loadLists')
	try {
		const res = await fetch(`/lists.json`)
		const json = await res.json()
		lists.set(json.lists)
	} catch (e) {
		console.log(e)
	}
}
