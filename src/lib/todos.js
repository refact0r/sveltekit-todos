import { writable } from 'svelte/store'

export let todos = writable()

export async function loadTodos(uid) {
	console.log('loadTodos')
	try {
		const res = await fetch(`/todos/${uid}.json`)
		const json = await res.json()
		todos.set(json.todos)
	} catch (e) {
		console.log(e)
	}
}
