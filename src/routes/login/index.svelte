<script>
	import { session } from '$app/stores'
	import { goto } from '$app/navigation'

	// Variables bound to respective inputs via bind:value
	let email
	let password
	let error

	const login = async () => {
		// Reset error from previous failed attempts
		error = undefined

		// POST method to src/routes/auth/login.js endpoint
		try {
			const res = await fetch('/auth/login', {
				method: 'POST',
				body: JSON.stringify({
					email,
					password
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (res.ok) {
				const data = await res.json()
				$session.user = data.user
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

<section>
	<form on:submit|preventDefault={login}>
		<h2>Login</h2>
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
		<button type="submit">Login</button>
	</form>
</section>

<style>
	section {
		background: var(--bg-color-1);
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
</style>
