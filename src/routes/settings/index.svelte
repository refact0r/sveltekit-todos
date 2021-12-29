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

	async function updateUser() {
		await fetch('/user', {
			method: 'PUT',
			body: JSON.stringify($session.user)
		})
	}

	async function setTheme(theme) {
		$session.user.theme = theme
		updateUser()
	}

	async function editName(e) {
		if (e.target.value == '') {
			e.target.value = $session.user.name
			return
		}
		$session.user.name = e.target.value
		updateUser()
	}

	function blurOnEnter(event) {
		if (event.keyCode === 13) {
			event.target.blur()
		}
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
		<input
			type="text"
			value={$session.user.name}
			on:change={(e) => editName(e)}
			on:keydown={(e) => blurOnEnter(e)}
		/>
		<h5>Email</h5>
		<input
			type="email"
			name="email"
			value={$session.user.email}
			on:change={(e) => editName(e)}
			on:keydown={(e) => blurOnEnter(e)}
		/>
		<br /><br />
		<button on:click={logout}>Log out</button>
		<h3>Appearance</h3>
		<h5>Theme</h5>
		<div class="themes">
			<button
				class={'theme dark' + ($session.user.theme === 'dark' ? ' active' : '')}
				on:click={() => setTheme('dark')}
			/>
			<button
				class={'theme light' + ($session.user.theme === 'light' ? ' active' : '')}
				on:click={() => setTheme('light')}
			/>
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
		border-radius: 40px;
		border: 2px solid transparent;
	}
	.theme.active {
		border-color: var(--font-color);
	}
	.theme.dark {
		background: linear-gradient(135deg, #192024 0%, #192024 50%, #13181b 50%, #13181b 100%);
	}
	.theme.light {
		background: linear-gradient(135deg, #dbf3ff 0%, #dbf3ff 50%, #c2dae5 50%, #c2dae5 100%);
	}
</style>
