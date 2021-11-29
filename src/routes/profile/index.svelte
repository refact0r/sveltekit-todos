<script context="module">
	export async function load({ session }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
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
	}
</script>

<h1>Profile</h1>
<p>Hello {name} you are logged in with the email {email}</p>
<button on:click={logout}>log out</button>
