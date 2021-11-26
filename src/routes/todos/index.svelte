<script context="module">
	export async function load({ fetch }) {
		const res = await fetch('/todos.json')
		const json = await res.json()
		return { props: { todos: json.todos } }
	}
</script>

<script>
	export let todos
	let text = ''

	async function loadTodos() {
		const res = await fetch('/todos.json')
		const json = await res.json()
		todos = json.todos
	}

	async function addTodo() {
		const todo = {
			name: text,
			completed: false
		}
		console.log(todo)
		await fetch('/todos.json', {
			method: 'POST',
			body: JSON.stringify(todo)
		})
		text = ''
		loadTodos()
	}

	async function completeTodo(todo) {
		await fetch('/todos.json', {
			method: 'PUT',
			body: JSON.stringify(todo)
		})
		loadTodos()
	}
</script>

<svelte:head>
	<title>Todos</title>
</svelte:head>

<div class="todos">
	<h1>Todos</h1>
	<form on:submit|preventDefault={addTodo}>
		<input type="text" placeholder="enter a todo" bind:value={text} />
		<button type="submit">add</button>
	</form>
	<br />
	{#each todos as todo}
		{#if !todo.completed}
			<div class="todo">
				<input
					type="checkbox"
					bind:checked={todo.completed}
					on:change={completeTodo(todo)}
				/>
				{todo.name}
			</div>
		{/if}
	{/each}
	<br />
	<h2>Completed</h2>
	{#each todos as todo}
		{#if todo.completed}
			<div class="todo completed">
				<input
					type="checkbox"
					bind:checked={todo.completed}
					on:change={completeTodo(todo)}
				/>
				{todo.name}
			</div>
		{/if}
	{/each}
</div>

<style>
	.todos {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
	form {
		width: 100%;
		display: flex;
	}
	input[type='text'] {
		width: 100%;
	}
	.completed {
		text-decoration: line-through;
	}
</style>
