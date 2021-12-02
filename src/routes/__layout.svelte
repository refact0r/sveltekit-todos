<script>
	import '../app.css'
	import Nav from '$lib/header/Nav.svelte'
	import { session } from '$app/stores'
</script>

{#if $session.user}
	<Nav />
{/if}

<main>
	<slot />
</main>

<style>
	main {
		width: 100%;
		height: calc(100vh - 40px);
		border-radius: 18px;
		background: var(--bg-color-1);
		margin: 20px 20px 20px 0;
		padding: 20px 0;
	}
	/*
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
	*/
</style>
