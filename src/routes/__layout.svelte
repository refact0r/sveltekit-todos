<script context="module">
	export async function load({ page, session }) {
		console.log(session)
		return {
			props: {
				key: page.path
			}
		}
	}
</script>

<script>
	import '../app.css'
	import { session } from '$app/stores'
	import { fly } from 'svelte/transition'
	import { todos } from '$lib/stores.js'
	import Nav from '$lib/Nav.svelte'
	export let key

	async function loadTodos() {
		const res = await fetch(`/todos/${$session.user.uid}.json`)
		const json = await res.json()
		todos.set(json.todos)
	}

	async function loadUser() {
		const res = await fetch('/user')
		const user = await res.json()
		$session.user = {
			uid: user._id,
			name: user.name,
			email: user.email
		}
	}

	$: if ($session.user) {
		loadTodos()
		if (!$session.user.name) {
			loadUser()
		}
	}

	$: console.log($session)
</script>

{#if $session.user}
	<Nav />
	<main class="with-nav">
		{#key key}
			<div
				class="content-container"
				in:fly={{ y: -5, duration: 200, delay: 200 }}
				out:fly|local={{ y: 5, duration: 200 }}
			>
				<slot />
			</div>
		{/key}
	</main>
{:else}
	<div class="background">
		{#key key}
			<div
				class="content-container"
				in:fly={{ x: -5, duration: 200, delay: 200 }}
				out:fly|local={{ x: 5, duration: 200 }}
			>
				<slot />
			</div>
		{/key}
	</div>
{/if}

<style>
	main {
		width: 100%;
		background: var(--bg-color-1);
		height: calc(100vh - 40px);
		border-radius: 18px;
		margin: 20px;
	}

	.content-container {
		height: 100%;
		width: 100%;
	}

	.background {
		background: var(--bg-color-1);
		height: 100%;
		width: 100%;
	}
</style>
