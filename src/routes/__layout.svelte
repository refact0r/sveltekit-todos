<script>
	import '../app.css'
	import Nav from '$lib/Nav/Nav.svelte'
	import { session } from '$app/stores'
</script>

{#if $session.user}
	<Nav />
	<main>
		<slot />
	</main>
{:else}
	<slot />
{/if}

<style>
	main {
		width: 100%;
		height: calc(100vh - 40px);
		border-radius: 18px;
		background: var(--bg-color-1);
		margin: 20px;
		padding: 20px 0;
	}
</style>
