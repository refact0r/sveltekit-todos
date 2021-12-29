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
	import { goto } from '$app/navigation'
	import { session } from '$app/stores'
	import { todos } from '$lib/stores/todos.js'

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
	<title>Settings</title>
</svelte:head>

<div class="content">
	<h1>Settings</h1>
	{#if $session.user}
		<h3>Account</h3>
		<h5>Username</h5>
		<input value={$session.user.name} />
		<h5>Email</h5>
		<input type="email" name="email" value={$session.user.email} />
		<br /><br />
		<button on:click={logout}>Log out</button>
		<h3>Appearance</h3>
		<h5>Theme</h5>
		<div class="themes">
			<button class={'theme dark' + ($session.user.theme === 'dark' ? 'active' : '')} />
			<button class={'theme light' + ($session.user.theme === 'light' ? 'active' : '')} />
		</div>
	{/if}
</div>

<style>
	.content {
		padding: 40px;
	}

	h1 {
		margin-top: 0;
	}

	h5 {
		margin: 0.5rem 0;
	}

	input {
		background: var(--bg-color-2);
		padding: 10px;
		border-radius: 12px;
	}

	button {
		background: var(--bg-color-2);
		padding: 10px;
		border-radius: 12px;
	}
	button:hover {
		background: var(--bg-color-2-5);
	}

	.theme {
		padding: 0;
		width: 40px;
		height: 40px;
		border-radius: 20px;
	}
</style>
