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
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { quartOut } from 'svelte/easing'
	import { goto } from '$app/navigation'
	import { lists, loadLists } from '$lib/stores/lists.js'
	import { todos, loadTodos } from '$lib/stores/todos.js'
	import DateModal from '$lib/DateModal.svelte'
	import { epochToText } from '$lib/date.js'

	export let listId
	let text = ''
	let listIndex
	let modal
	let currentTodo

	onMount(() => {
		let now = new Date(),
			delay = 60000 - (now % 60000)
		setTimeout(
			setInterval(() => {
				$todos = $todos
			}, 60000),
			delay
		)
	})

	$: if ($lists) {
		listIndex = $lists.findIndex((list) => list._id === listId)
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

	async function addTodo() {
		if (text == '') {
			return
		}
		const todo = {
			name: text,
			completed: false,
			listId: listId,
			dueDate: null
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

	async function completeTodo(todo) {
		todo.completed = !todo.completed
		$todos = $todos
		await fetch(`/todos.json`, {
			method: 'PUT',
			body: JSON.stringify(todo)
		})
	}

	async function editName(todo, e) {
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

	async function deleteTodo(todo) {
		$todos = $todos.filter((t) => t !== todo)
		await fetch(`/todos.json`, {
			method: 'DELETE',
			body: JSON.stringify(todo)
		})
	}

	async function startEditDate(todo) {
		currentTodo = todo
		modal.show(todo.dueDate)
	}

	async function finishEditDate(date) {
		if (!date && currentTodo.dueDate !== null) {
			currentTodo.dueDate = null
			$todos = $todos
			await fetch(`/todos.json`, {
				method: 'PUT',
				body: JSON.stringify(currentTodo)
			})
		}
		if (date && date.getTime() != currentTodo.dueDate) {
			currentTodo.dueDate = date.getTime()
			$todos = $todos
			await fetch(`/todos.json`, {
				method: 'PUT',
				body: JSON.stringify(currentTodo)
			})
		}
		currentTodo = null
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
				{#each $todos.filter((todo) => todo.listId === listId && !todo.completed) as todo (todo._id)}
					<div class="todo" transition:slide|local={{ duration: 400, easing: quartOut }}>
						<button
							class={'icon-button ' +
								(todo.completed ? 'checkbox checked' : 'checkbox')}
							on:click={() => completeTodo(todo)}
						>
							<i class="bi bi-check-lg" />
						</button>
						<input
							class="name"
							type="text"
							value={todo.name}
							on:change={(e) => editName(todo, e)}
							on:keydown={(e) => blurOnEnter(e)}
						/>
						{#if todo.dueDate}
							<button
								class={'due-date' +
									(new Date(todo.dueDate) - new Date() <= 0 ? ' overdue' : '')}
								on:click={() => startEditDate(todo)}
							>
								{epochToText(todo.dueDate)}
							</button>
						{:else}
							<button
								class="icon-button new-date"
								on:click={() => startEditDate(todo)}
							>
								<i class="bi bi-calendar2-plus" />
							</button>
						{/if}
						<button class="icon-button delete" on:click={() => deleteTodo(todo)}>
							<i class="bi bi-x-lg" />
						</button>
					</div>
				{/each}
				{#if $todos.find((todo) => todo.listId === listId && todo.completed)}
					<h2 transition:slide|local={{ duration: 400, easing: quartOut }}>Completed</h2>
				{/if}
				{#each $todos.filter((todo) => todo.listId === listId && todo.completed) as todo (todo._id)}
					<div
						class="todo completed"
						transition:slide|local={{ duration: 400, easing: quartOut }}
					>
						<button
							class={'icon-button ' +
								(todo.completed ? 'checkbox checked' : 'checkbox')}
							on:click={() => completeTodo(todo)}
						>
							<i class="bi bi-check-lg" />
						</button>
						<input
							class="name"
							type="text"
							value={todo.name}
							on:change={(e) => editName(todo, e)}
							on:keydown={(e) => blurOnEnter(e)}
						/>
						{#if todo.dueDate}
							<button class="due-date" on:click={() => startEditDate(todo)}>
								{epochToText(todo.dueDate)}
							</button>
						{:else}
							<button
								class="icon-button new-date"
								on:click={() => startEditDate(todo)}
							>
								<i class="bi bi-calendar2-plus" />
							</button>
						{/if}
						<button class="icon-button delete" on:click={() => deleteTodo(todo)}>
							<i class="bi bi-x-lg" />
						</button>
					</div>
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
<DateModal bind:this={modal} edit={(date) => finishEditDate(date)} />

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
