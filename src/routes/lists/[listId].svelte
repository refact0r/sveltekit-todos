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
	import { slide } from 'svelte/transition'
	import { quartOut } from 'svelte/easing'
	import { goto } from '$app/navigation'
	import { session } from '$app/stores'
	import { lists, loadLists } from '$lib/stores/lists.js'
	import { todos, loadTodos } from '$lib/stores/todos.js'

	export let listId
	let text = ''
	let listTodos
	let listIndex

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
		text = ''
		console.log(todo)
		const res = await fetch(`/todos.json`, {
			method: 'POST',
			body: JSON.stringify(todo)
		})
		const json = await res.json()
		$todos.push(json.todo)
		$todos = $todos
	}

	async function completeTodo(index) {
		$todos[index].completed = !$todos[index].completed
		await fetch(`/todos.json`, {
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
		await fetch(`/todos.json`, {
			method: 'PUT',
			body: JSON.stringify(todo)
		})
	}

	async function deleteTodo(index) {
		const todo = $todos.splice(index, 1)[0]
		$todos = $todos
		await fetch(`/todos.json`, {
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
		await fetch(`/lists.json`, {
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
		await fetch(`/lists.json`, {
			method: 'DELETE',
			body: JSON.stringify(list)
		})
		loadTodos()
	}

	async function sync() {
		loadTodos()
		loadLists()
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
			<button class="icon-button-lg sync" on:click={() => sync()}>
				<i class="bi bi-arrow-repeat" />
			</button>
		</div>
		<div class="item-container">
			{#if $todos}
				{#each $todos as todo, index}
					{#if todo.listId === listId && !todo.completed}
						<div
							class="todo"
							transition:slide|local={{ duration: 400, easing: quartOut }}
						>
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
				{#if $todos.find((todo) => todo.listId === listId && todo.completed)}
					<h2 transition:slide|local={{ duration: 400, easing: quartOut }}>Completed</h2>
				{/if}
				{#each $todos as todo, index}
					{#if todo.listId === listId && todo.completed}
						<div
							class="todo completed"
							transition:slide|local={{ duration: 400, easing: quartOut }}
						>
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

	.list-name {
		font-size: 2em;
		font-weight: bold;
		background: none;
		margin-right: auto;
		width: 100%;
	}

	.delete-list i {
		font-size: 1rem;
	}
</style>
