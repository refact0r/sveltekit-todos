<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		const res = await fetch(`/todos/${session.user.uid}.json`)
		const json = await res.json()
		return { props: { todos: json.todos, user: session.user } }
	}
</script>

<script>
	import About from '../about.svelte'

	export let todos
	export let user
	let text = ''

	async function loadTodos() {
		const res = await fetch(`/todos/${user.uid}.json`)
		const json = await res.json()
		todos = json.todos
	}

	async function addTodo() {
		if (text == '') {
			return
		}
		const todo = {
			name: text,
			completed: false
		}
		console.log(todo)
		await fetch(`/todos/${user.uid}.json`, {
			method: 'POST',
			body: JSON.stringify(todo)
		})
		text = ''
		loadTodos()
	}

	async function completeTodo(todo) {
		todo.completed = !todo.completed
		await fetch(`/todos/${user.uid}.json`, {
			method: 'PUT',
			body: JSON.stringify(todo)
		})
		loadTodos()
	}

	async function editTodo(todo, name) {
		todo.name = name
		await fetch(`/todos/${user.uid}.json`, {
			method: 'PUT',
			body: JSON.stringify(todo)
		})
		loadTodos()
	}

	async function deleteTodo(todo) {
		await fetch(`/todos/${user.uid}.json`, {
			method: 'DELETE',
			body: JSON.stringify(todo)
		})
		loadTodos()
	}
</script>

<svelte:head>
	<title>Todos</title>
</svelte:head>

<div class="todos">
	<div class="header-container">
		<h1 class="header">Todos</h1>
	</div>
	<div class="list">
		{#each todos as todo}
			{#if !todo.completed}
				<div class="todo">
					<button
						class={todo.completed ? 'checkbox checked' : 'checkbox'}
						on:click={() => completeTodo(todo)}
					>
						<i class="bi bi-check-lg" />
					</button>
					<input
						class="name"
						type="text"
						value={todo.name}
						on:change={(e) => editTodo(todo, e.target.value)}
					/>
					<button class="delete" on:click={deleteTodo(todo)}
						><i class="bi bi-x-lg" /></button
					>
				</div>
			{/if}
		{/each}
		<h2>Completed</h2>
		{#each todos as todo}
			{#if todo.completed}
				<div class="todo completed">
					<button
						class={todo.completed ? 'checkbox checked' : 'checkbox'}
						on:click={() => completeTodo(todo)}
					>
						<i class="bi bi-check-lg" />
					</button>
					<input
						class="name"
						type="text"
						value={todo.name}
						on:change={(e) => editTodo(todo, e.target.value)}
					/>
					<button class="delete" on:click={deleteTodo(todo)}
						><i class="bi bi-x-lg" /></button
					>
				</div>
			{/if}
		{/each}
	</div>
	<div class="new-container">
		<form class="new" on:submit|preventDefault={addTodo}>
			<button class="add" type="submit"><i class="bi bi-plus-lg" /></button>
			<input class="name" type="text" placeholder="add a todo" bind:value={text} />
		</form>
	</div>
</div>

<style>
	.todos {
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100%;
		overflow-y: scroll;
		scrollbar-color: var(--scrollbar-color) transparent;
		scrollbar-width: thin;
	}

	.list {
		padding: 10px 40px 88px 40px;
	}

	button {
		color: inherit;
		font: inherit;
		background: var(--bg-color-2);
		border: none;
	}
	button:hover {
		cursor: pointer;
	}

	input {
		color: inherit;
		font: inherit;
		background: var(--bg-color-2);
		border: none;
		padding: 0;
	}
	input::placeholder {
		color: var(--sub-color);
	}

	.todo {
		display: flex;
		background: var(--bg-color-2);
		align-items: center;
		border-radius: 12px;
		padding: 10px;
		margin-bottom: 6px;
	}
	.todo.completed .name {
		text-decoration: line-through;
		color: var(--sub-color);
	}
	.todo.completed .checkbox i {
		display: block;
	}

	.checkbox {
		width: 20px;
		height: 20px;
		border-radius: 6px;
		padding: 0;
		margin-right: 10px;
		background: var(--bg-color-3);
		line-height: 20px;
	}
	.checkbox:hover {
		background: var(--sub-color);
	}
	.checkbox i {
		display: none;
		margin-right: 2px;
	}

	.delete {
		margin-left: auto;
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		padding: 0;
		color: var(--sub-color);
	}
	.delete:hover {
		color: var(--font-color);
	}

	.name {
		background: none;
	}
	.name:focus {
		outline: none;
	}

	.header-container {
		background: var(--bg-color-1);
		position: sticky;
		top: 0;
		width: 100%;
		padding: 20px 40px 10px 40px;
		border-radius: 18px;
	}

	.header {
		margin: 0;
	}

	.new-container {
		margin-top: auto;
		background: var(--bg-color-1);
		padding: 10px 40px 20px 40px;
		position: sticky;
		bottom: 0;
		width: 100%;
		border-radius: 18px;
	}

	.new {
		display: flex;
		background: var(--bg-color-2);
		align-items: center;
		border-radius: 12px;
		padding: 10px;
	}
	.new .name {
		width: 100%;
	}

	.add {
		width: 20px;
		height: 20px;
		padding: 0;
		margin-right: 10px;
		font-size: 20px;
		line-height: 20px;
		color: var(--sub-color);
	}
	.add:hover {
		color: var(--font-color);
	}

	/*
	.todos {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
	form {
		width: 100%;
		display: flex;
	}
	.todo {
		display: flex;
		width: 100%;
		align-items: center;
		margin: 10px 0;
	}
	.todoName {
		background: none;
		border: none;
	}
	input[type='text'] {
		width: 100%;
	}
	input[type='checkbox'] {
		margin: 0 10px 0 0;
	}
	button {
		min-width: 80px;
	}
	.editButton {
		margin-left: auto;
	}
	.deleteButton {
		margin-left: 10px;
	}
	.addButton {
		margin-left: 10px;
	}
	*/
</style>
