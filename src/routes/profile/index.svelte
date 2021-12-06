<script context="module">
	export async function load({ fetch, session }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}

		if (!session.user.name) {
			const res = await fetch('/user')
			const user = await res.json()
			session.user = {
				uid: user._id,
				name: user.name,
				email: user.email
			}
		}

		return {
			props: {
				name: session.user.name,
				email: session.user.email
			}
		}
	}
</script>

<script>
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { session } from '$app/stores'

	export let email
	export let name
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
		goto('/')
	}
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="content">
	<h1>Profile</h1>
	<p>Hello {name} you are logged in with the email {email}</p>
	<button on:click={logout}>log out</button>
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
