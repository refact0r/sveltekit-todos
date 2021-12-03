<script>
	import { page } from '$app/stores'
	import logo from './svelte-logo.svg'
</script>

<nav>
	<div class="header" href="/">
		<img src={logo} alt="SvelteKit" />
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
		background: var(--bg-color-3);
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

	/*

	

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
	*/
</style>
