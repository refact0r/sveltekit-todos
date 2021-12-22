<script context="module">
	export async function load({ session }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {}
	}
</script>

<script>
	import { session } from '$app/stores'
	import { todos, loadTodos } from '$lib/todos.js'
	let text = ''

	$: console.log($session)

	async function addTodo() {
		if (text == '') {
			return
		}
		const todo = {
			name: text,
			completed: false
		}
		console.log(todo)
		await fetch(`/todos/${$session.user.uid}.json`, {
			method: 'POST',
			body: JSON.stringify(todo)
		})
		text = ''
		loadTodos()
	}

	async function completeTodo(index) {
		$todos[index].completed = !$todos[index].completed
		await fetch(`/todos/${$session.user.uid}.json`, {
			method: 'PUT',
			body: JSON.stringify($todos[index])
		})
	}

	async function editTodo(todo, e) {
		if (e.target.value == '') {
			e.target.value = todo.name
			return
		}
		todo.name = e.target.value
		await fetch(`/todos/${$session.user.uid}.json`, {
			method: 'PUT',
			body: JSON.stringify(todo)
		})
		loadTodos($session.user.uid)
	}

	async function deleteTodo(index) {
		const todo = $todos.splice(index, 1)[0]
		todos.set($todos)
		await fetch(`/todos/${$session.user.uid}.json`, {
			method: 'DELETE',
			body: JSON.stringify(todo)
		})
	}

	function blurOnEnter(event) {
		if (event.keyCode === 13) {
			event.target.blur()
		}
	}
</script>

<svelte:head>
	<title>Todos</title>
</svelte:head>

<div class="content">
	<div class="list-container">
		<div class="heading-container">
			<h1>Todos</h1>
			<button class="sync" on:click={() => loadTodos($session.user.uid)}
				><i class="bi bi-arrow-repeat" /></button
			>
		</div>
		<div class="list">
			{#if $todos}
				{#each $todos as todo, index}
					{#if !todo.completed}
						<div class="todo">
							<button
								class={todo.completed ? 'checkbox checked' : 'checkbox'}
								on:click={() => completeTodo(index)}
							>
								<i class="bi bi-check-lg" />
							</button>
							<input
								class="name"
								type="text"
								value={todo.name}
								on:change={(e) => editTodo(todo, e)}
								on:keydown={(e) => blurOnEnter(e)}
							/>
							<button class="delete" on:click={() => deleteTodo(index)}
								><i class="bi bi-x-lg" /></button
							>
						</div>
					{/if}
				{/each}
				{#if $todos.find((todo) => todo.completed)}
					<h2>Completed</h2>
				{/if}
				{#each $todos as todo, index}
					{#if todo.completed}
						<div class="todo completed">
							<button
								class={todo.completed ? 'checkbox checked' : 'checkbox'}
								on:click={() => completeTodo(index)}
							>
								<i class="bi bi-check-lg" />
							</button>
							<input
								class="name"
								type="text"
								value={todo.name}
								on:change={(e) => editTodo(todo, e)}
								on:keydown={(e) => blurOnEnter(e)}
							/>
							<button class="delete" on:click={() => deleteTodo(index)}
								><i class="bi bi-x-lg" /></button
							>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
		<div class="new-container">
			<form class="new" on:submit|preventDefault={addTodo}>
				<button class="add" type="submit"><i class="bi bi-plus-lg" /></button>
				<input class="name" type="text" placeholder="Add a todo" bind:value={text} />
			</form>
		</div>
	</div>
</div>

<style>
	.content {
		position: relative;
		height: 100%;
		padding: 20px 0;
	}

	.list-container {
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		scrollbar-color: var(--bg-color-1-5) transparent;
		height: 100%;
	}

	.list {
		padding: 10px 40px 88px 40px;
	}

	button {
		background: transparent;
	}

	input {
		width: 100%;
		background: var(--bg-color-2);
		padding: 0;
	}

	.todo {
		display: flex;
		background: var(--bg-color-2);
		align-items: center;
		border-radius: 12px;
		padding: 10px;
		margin-bottom: 8px;
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
		background: var(--bg-color-3-5);
	}
	.checkbox:active {
		background: var(--font-color);
	}
	.checkbox i {
		display: none;
		margin-right: 2px;
	}

	.delete {
		margin-left: 10px;
		width: 24px;
		height: 24px;
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

	.heading-container {
		background: var(--bg-color-1);
		position: sticky;
		top: 0;
		width: 100%;
		padding: 20px 40px 10px 40px;
		border-radius: 18px;
		display: flex;
		align-items: center;
	}

	h1 {
		margin: 0;
		margin-right: auto;
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
		width: 24px;
		height: 24px;
		padding: 0;
		margin-right: 10px;
		font-size: 20px;
		line-height: 20px;
		color: var(--sub-color);
	}
	.add:hover {
		color: var(--font-color);
	}

	.sync {
		width: 36px;
		height: 36px;
		background: var(--bg-color-2);
		border-radius: 10px;
	}
	.sync:hover {
		background-color: var(--bg-color-2-5);
	}

	.sync i {
		font-size: 20px;
	}
</style>
