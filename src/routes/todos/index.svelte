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
	import { lists } from '$lib/stores/lists.js'
	let text = ''

	async function addTodo() {
		if (text == '') {
			return
		}
		const todo = {
			name: text,
			completed: false,
			listId: ''
		}
		text = ''
		console.log(todo)
		await fetch(`/todos/${$session.user._id}.json`, {
			method: 'POST',
			body: JSON.stringify(todo)
		})
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
		$todos = $todos
		await fetch(`/todos/${$session.user._id}.json`, {
			method: 'DELETE',
			body: JSON.stringify(todo)
		})
	}

	async function sync() {
		loadTodos($session.user._id)
		loadLists($session.user._id)
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
			<button class="icon-button-lg sync" on:click={() => sync()}
				><i class="bi bi-arrow-repeat" />
			</button>
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
							<div class="text">
								<input
									class="name"
									type="text"
									value={todo.name}
									on:change={(e) => editTodo(todo, e)}
									on:keydown={(e) => blurOnEnter(e)}
								/>
								{#if todo.listId && $lists.find((list) => todo.listId === list._id)}
									<a
										class="list-name"
										sveltekit:prefetch
										href="/lists/{todo.listId}"
										>{$lists.find((list) => todo.listId === list._id).name}</a
									>
								{/if}
							</div>
							<button class="icon-button delete" on:click={() => deleteTodo(index)}
								><i class="bi bi-x-lg" />
							</button>
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
							<div class="text">
								<input
									class="name"
									type="text"
									value={todo.name}
									on:change={(e) => editTodo(todo, e)}
									on:keydown={(e) => blurOnEnter(e)}
								/>
								{#if todo.listId && $lists.find((list) => todo.listId === list._id)}
									<a
										class="list-name"
										sveltekit:prefetch
										href="/lists/{todo.listId}"
										>{$lists.find((list) => todo.listId === list._id).name}</a
									>
								{/if}
							</div>
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
				<button class={'icon-button add' + (text ? ' active' : '')} type="submit">
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

	.text {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	input {
		width: 100%;
		background: transparent;
		padding: 0;
		line-height: 24px;
	}

	.list-name {
		font-size: 0.75em;
		line-height: 1em;
		color: var(--sub-color);
		text-decoration: none;
		width: fit-content;
	}
	.list-name:hover {
		color: var(--font-color);
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
</style>
