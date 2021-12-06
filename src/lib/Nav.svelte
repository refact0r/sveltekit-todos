<script>
	import { page } from '$app/stores'
</script>

<nav>
	<div class="header" href="/">
		<img src="svelte-logo.svg" alt="SvelteKit" />
		<h1>Todos</h1>
	</div>
	<a class:active={$page.path === '/'} sveltekit:prefetch href="/">Home</a>
	<a class:active={$page.path === '/about'} sveltekit:prefetch href="/about">About</a>
	<a class:active={$page.path === '/todos'} sveltekit:prefetch href="/todos">Todos</a>
	<a class:active={$page.path === '/profile'} sveltekit:prefetch href="/profile">Profile</a>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		width: 240px;
		background: var(--bg-color-2);
		padding: 20px 0 20px 20px;
	}

	a {
		color: inherit;
		text-decoration: none;
		padding: 10px;
		margin: 3px 0;
		border-radius: 10px;
	}
	a:hover {
		background: var(--bg-color-2-5);
	}

	.header {
		display: flex;
		align-items: center;
		margin: 10px 0 20px 5px;
	}

	.header img {
		width: 32px;
		height: 32px;
		filter: saturate(0) brightness(0.6) contrast(2) invert(77%) sepia(38%) saturate(246%)
			hue-rotate(156deg) brightness(86%) contrast(89%);
	}

	h1 {
		margin: 0 0 0 12px;
		font-size: 2rem;
	}
</style>
