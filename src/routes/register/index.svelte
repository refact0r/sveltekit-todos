<script context="module">
	export async function load({ session }) {
		if (session.user) {
			return {
				status: 302,
				redirect: '/'
			}
		}
		return {}
	}
</script>

<script>
	import { session } from '$app/stores'
	import { goto } from '$app/navigation'
	import { loadTodos } from '$lib/todos.js'

	// Variables bound to respective inputs via bind:value
	let email
	let password
	let name
	let error

	const register = async () => {
		// Reset error from previous failed attempts
		error = undefined

		try {
			// POST method to src/routes/auth/register.js endpoint
			const res = await fetch('/auth/register', {
				method: 'POST',
				body: JSON.stringify({
					email,
					password,
					name
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (res.ok) {
				const data = await res.json()
				$session.user = data.user
				loadTodos($session.user.uid)
				goto('/')
			} else {
				error = 'An error occured'
			}
		} catch (err) {
			console.log(err)
			error = 'An error occured'
		}
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<section>
	<form on:submit|preventDefault={register}>
		<div class="heading">
			<a class="back" href="/"><i class="bi bi-arrow-left" /></a>
			<h2>Register</h2>
		</div>
		<input type="text" name="name" placeholder="Enter your name" bind:value={name} />
		<input type="email" name="email" placeholder="Enter your email" bind:value={email} />
		<input
			type="password"
			name="password"
			placeholder="Enter your password"
			bind:value={password}
		/>
		{#if error}
			<p>{error}</p>
		{/if}
		<button type="submit">Register</button>
	</form>
</section>

<style>
	section {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	form {
		width: 400px;
		padding: 20px;
		border-radius: 18px;
		background: var(--bg-color-2);
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	input,
	button {
		margin-top: 10px;
		border-radius: 12px;
		padding: 10px;
		background: var(--bg-color-1);
	}

	button:hover {
		background: var(--bg-color-1-5);
	}

	.heading {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	h2 {
		width: 100%;
		text-align: center;
		margin-right: 24px;
	}

	.back {
		color: var(--sub-color);
		font-size: 24px;
		height: 24px;
	}
	.back:hover {
		color: var(--font-color);
	}
</style>
