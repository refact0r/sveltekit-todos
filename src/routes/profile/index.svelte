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
	import { goto } from '$app/navigation'
	import { session } from '$app/stores'
	import { todos } from '$lib/stores/todos.js'
	/*
	let name

	onMount(async () => {
		const res = await fetch('/user')
		const user = await res.json()
		name = user.name
	})
    */

	async function logout() {
		const res = await fetch('/auth/logout', {
			method: 'POST'
		})
		$session.user = null
		$todos = null
		goto('/')
	}
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="content">
	<h1>Profile</h1>
	{#if $session.user && $session.user.name}
		<p>Hello {$session.user.name} you are logged in with the email {$session.user.email}</p>
	{/if}
	<button on:click={logout}>Log out</button>
</div>

<style>
	.content {
		padding: 40px;
	}

	h1 {
		margin-top: 0;
	}

	button {
		background: var(--bg-color-2);
		padding: 10px;
		border-radius: 12px;
	}
</style>
