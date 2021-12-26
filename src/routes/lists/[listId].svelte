<script context="module">
	export async function load({ session, page }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {
			props: {
				listId: page.params.listId
			}
		}
	}
</script>

<script>
	import { goto } from '$app/navigation'
	import { session } from '$app/stores'
	import { lists } from '$lib/stores/lists.js'
	import { todos, loadTodos } from '$lib/stores/todos.js'

	export let listId
	let text = ''
	let listTodos
	let listIndex

	$: if ($todos) {
		listTodos = $todos.filter((todo) => todo.listId === listId)
	}

	$: if ($lists) {
		listIndex = $lists.findIndex((list) => list._id === listId)
	}

	async function addTodo() {
		if (text == '') {
			return
		}
		const todo = {
			name: text,
			completed: false,
			listId: listId
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
		$todos = $todos
		await fetch(`/todos/${$session.user._id}.json`, {
			method: 'DELETE',
			body: JSON.stringify(todo)
		})
	}

	async function editList(e) {
		if (e.target.value == '') {
			e.target.value = $lists[listIndex].name
			return
		}
		$lists[listIndex].name = e.target.value
		await fetch(`/lists/${$session.user._id}.json`, {
			method: 'PUT',
			body: JSON.stringify($lists[listIndex])
		})
	}

	async function deleteList() {
		if (listIndex === 0) {
			goto('/todos')
		} else {
			goto(`/lists/${$lists[listIndex - 1]._id}`)
		}
		const list = $lists.splice(listIndex, 1)[0]
		$lists = $lists
		await fetch(`/lists/${$session.user._id}.json`, {
			method: 'DELETE',
			body: JSON.stringify(list)
		})
		loadTodos($session.user._id)
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
			<input
				class="list-name"
				type="text"
				value={$lists && $lists[listIndex] ? $lists[listIndex].name : ''}
				on:change={(e) => editList(e)}
				on:keydown={(e) => blurOnEnter(e)}
			/>
			<button class="icon-button-lg delete-list" on:click={() => deleteList()}>
				<i class="bi bi-trash" />
			</button>
			<button class="icon-button-lg sync" on:click={() => loadTodos($session.user._id)}>
				<i class="bi bi-arrow-repeat" />
			</button>
		</div>
		<div class="list">
			{#if listTodos}
				{#each listTodos as todo, index}
					{#if !todo.completed}
						<div class="todo">
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
							<button class="icon-button delete" on:click={() => deleteTodo(index)}>
								<i class="bi bi-x-lg" />
							</button>
						</div>
					{/if}
				{/each}
				{#if listTodos.find((todo) => todo.completed)}
					<h2>Completed</h2>
				{/if}
				{#each listTodos as todo, index}
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
							<button class="icon-button delete" on:click={() => deleteTodo(index)}>
								<i class="bi bi-x-lg" />
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

	.list-name {
		font-size: 2em;
		font-weight: bold;
		background: none;
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
		margin-right: 12px;
		font-size: 20px;
		line-height: 20px;
	}

	.delete-list i {
		font-size: 1rem;
	}
</style>
