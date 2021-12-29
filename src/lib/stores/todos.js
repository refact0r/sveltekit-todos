import { writable } from 'svelte/store'

export let todos = writable()

export async function loadTodos() {
	console.log('loadTodos')
	try {
		const res = await fetch(`/todos.json`)
		const json = await res.json()
		todos.set(json.todos)
	} catch (e) {
		console.log(e)
	}
}
