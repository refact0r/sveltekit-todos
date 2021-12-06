<section>
	<div class="welcome">
		<h2>Welcome to Sveltekit Todos</h2>
		<a href="/login">Login</a>
		<a href="/register">Register</a>
	</div>
</section>

<style>
	section {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.welcome {
		width: 400px;
		padding: 20px;
		border-radius: 18px;
		background: var(--bg-color-2);
		display: flex;
		flex-direction: column;
	}

	h2 {
		text-align: center;
	}

	a {
		color: inherit;
		background: var(--bg-color-1);
		text-decoration: none;
		padding: 10px;
		border-radius: 12px;
		margin-top: 10px;
		text-align: center;
	}

	a:hover {
		background: var(--bg-color-1-5);
	}
</style>
