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
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { quartOut } from 'svelte/easing'
	import { todos, loadTodos } from '$lib/stores/todos.js'
	import { lists, loadLists } from '$lib/stores/lists.js'
	import DateModal from '$lib/DateModal.svelte'
	import { epochToText } from '$lib/date.js'

	let text = ''
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

	async function addTodo() {
		if (text == '') {
			return
		}
		const todo = {
			name: text,
			completed: false,
			listId: '',
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
			<h1>Todos</h1>
			<button class="icon-button-lg sync" on:click={() => sync()}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					class="bi bi-arrow-repeat"
					viewBox="0 0 16 16"
				>
					<path
						d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
					/>
					<path
						fill-rule="evenodd"
						d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
					/>
				</svg>
			</button>
		</div>
		<div class="item-container">
			{#if $todos}
				{#each $todos.filter((todo) => !todo.completed) as todo (todo._id)}
					<div class="todo" transition:slide|local={{ duration: 400, easing: quartOut }}>
						<button class="icon-button checkbox" on:click={() => completeTodo(todo)} />
						<div class="text-container">
							<input
								class="name"
								type="text"
								value={todo.name}
								on:change={(e) => editName(todo, e)}
								on:keydown={(e) => blurOnEnter(e)}
							/>
							{#if todo.listId && $lists.find((list) => todo.listId === list._id)}
								<a class="list-name" sveltekit:prefetch href="/lists/{todo.listId}">
									{$lists.find((list) => todo.listId === list._id).name}
								</a>
							{/if}
						</div>
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
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									class="bi bi-calendar2-plus"
									viewBox="0 0 16 16"
								>
									<path
										d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"
									/>
									<path
										d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM8 8a.5.5 0 0 1 .5.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8z"
									/>
								</svg>
							</button>
						{/if}
						<button class="icon-button delete" on:click={() => deleteTodo(todo)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								class="bi bi-x-lg"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
								/>
								<path
									fill-rule="evenodd"
									d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
								/>
							</svg>
						</button>
					</div>
				{/each}
				{#if $todos.find((todo) => todo.completed)}
					<h2 transition:slide|local={{ duration: 400, easing: quartOut }}>Completed</h2>
				{/if}
				{#each $todos.filter((todo) => todo.completed) as todo (todo._id)}
					<div
						class="todo completed"
						transition:slide|local={{ duration: 400, easing: quartOut }}
					>
						<button
							class="icon-button checkbox checked"
							on:click={() => completeTodo(todo)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								class="bi bi-check-lg"
								viewBox="0 0 16 16"
							>
								<path
									d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
								/>
							</svg>
						</button>
						<div class="text-container">
							<input
								class="name"
								type="text"
								value={todo.name}
								on:change={(e) => editName(todo, e)}
								on:keydown={(e) => blurOnEnter(e)}
							/>
							{#if todo.listId && $lists.find((list) => todo.listId === list._id)}
								<a class="list-name" sveltekit:prefetch href="/lists/{todo.listId}"
									>{$lists.find((list) => todo.listId === list._id).name}
								</a>
							{/if}
						</div>
						{#if todo.dueDate}
							<button class="due-date" on:click={() => startEditDate(todo)}>
								{epochToText(todo.dueDate)}
							</button>
						{:else}
							<button
								class="icon-button new-date"
								on:click={() => startEditDate(todo)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									class="bi bi-calendar2-plus"
									viewBox="0 0 16 16"
								>
									<path
										d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"
									/>
									<path
										d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM8 8a.5.5 0 0 1 .5.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8z"
									/>
								</svg>
							</button>
						{/if}
						<button class="icon-button delete" on:click={() => deleteTodo(todo)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								class="bi bi-x-lg"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
								/>
								<path
									fill-rule="evenodd"
									d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
								/>
							</svg>
						</button>
					</div>
				{/each}
			{/if}
		</div>
		<div class="new-container">
			<form class="new" on:submit|preventDefault={addTodo}>
				<button class={'icon-button add' + (text ? ' active' : '')} type="submit">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-plus-lg"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
						/>
					</svg>
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
		font-size: 0.8em;
		line-height: 1em;
		color: var(--sub-color);
		text-decoration: none;
		width: fit-content;
	}
	.list-name:hover {
		color: var(--font-color);
	}
</style>
