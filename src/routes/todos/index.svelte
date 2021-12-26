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
	import { todos, loadTodos } from '$lib/stores/todos.js'
	let text = ''

	async function addTodo() {
		if (text == '') {
			return
		}
		const todo = {
			name: text,
			completed: false,
			listId: null
		}
		console.log(todo)
		await fetch(`/todos/${$session.user._id}.json`, {
			method: 'POST',
			body: JSON.stringify(todo)
		})
		text = ''
		loadTodos($session.user._id)
	}

	async function completeTodo(index) {
		$todos[index].completed = !$todos[index].completed
		await fetch(`/todos/${$session.user._id}.json`, {
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
		await fetch(`/todos/${$session.user._id}.json`, {
			method: 'PUT',
			body: JSON.stringify(todo)
		})
	}

	async function deleteTodo(index) {
		const todo = $todos.splice(index, 1)[0]
		todos.set($todos)
		await fetch(`/todos/${$session.user._id}.json`, {
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
	<div class="scroll-container">
		<div class="heading-container">
			<h1>Todos</h1>
			<button class="sync" on:click={() => loadTodos($session.user._id)}
				><i class="bi bi-arrow-repeat" /></button
			>
		</div>
		<div class="list">
			{#if $todos}
				{#each $todos as todo, index}
					{#if !todo.completed}
						<div class="todo">
							<button
								class={'icon-button ' +
									(todo.completed ? 'checkbox checked' : 'checkbox')}
								on:click={() => completeTodo(index)}
							>
								<i class="bi bi-check-lg" />
							</button>
							<div />
							<input
								class="name"
								type="text"
								value={todo.name}
								on:change={(e) => editTodo(todo, e)}
								on:keydown={(e) => blurOnEnter(e)}
							/>
							<button class="icon-button delete" on:click={() => deleteTodo(index)}
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
								class={'icon-button ' +
									(todo.completed ? 'checkbox checked' : 'checkbox')}
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
							<button class="icon-button delete" on:click={() => deleteTodo(index)}
								><i class="bi bi-x-lg" />
							</button>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
		<div class="new-container">
			<form class="new" on:submit|preventDefault={addTodo}>
				<button class="icon-button add" type="submit">
					<i class="bi bi-plus-lg" />
				</button>
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

	.scroll-container {
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		scrollbar-color: var(--bg-color-1-5) transparent;
		height: 100%;
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

	.list {
		padding: 10px 40px 88px 40px;
	}

	input {
		width: 100%;
		background: var(--bg-color-2);
		padding: 0;
		line-height: 24px;
	}

	.todo {
		display: flex;
		background: var(--bg-color-2);
		align-items: center;
		border-radius: 12px;
		padding: 10px 12px;
		margin-bottom: 8px;
	}
	.todo.completed .name {
		text-decoration: line-through;
		color: var(--sub-color);
	}
	.todo.completed .checkbox i {
		display: inline-block;
	}

	.checkbox {
		border-radius: 6px;
		margin-right: 10px;
		background: var(--bg-color-3);
	}
	.checkbox:hover {
		background: var(--bg-color-3-5);
	}
	.checkbox:active {
		background: var(--font-color);
	}
	.checkbox i {
		display: none;
		color: var(--font-color);
		margin-right: 2px !important;
	}

	.delete {
		margin-left: 10px;
	}

	.name {
		background: none;
	}
	.name:focus {
		outline: none;
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
		padding: 10px 12px;
	}
	.new .name {
		width: 100%;
	}

	.add {
		padding: 0;
		margin-right: 10px;
		font-size: 20px;
		line-height: 20px;
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
