<script>
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { lists, loadLists } from '$lib/stores/lists.js'
	import logo from './svelte-logo.svg'

	async function addList() {
		const list = {
			name: 'New list'
		}
		console.log(list)
		const res = await fetch(`/lists.json`, {
			method: 'POST',
			body: JSON.stringify(list)
		})
		loadLists()
		const json = await res.json()
		goto(`/lists/${json.list._id}`)
	}
</script>

<nav>
	<a class="logo" href="/">
		<img src={logo} alt="SvelteKit" />
		<h1>Todos</h1>
	</a>
	<div class="scroll-container">
		<a class:active={$page.path === '/'} sveltekit:prefetch href="/">Home</a>
		<a class:active={$page.path === '/todos'} sveltekit:prefetch href="/todos">Todos</a>
		<a class:active={$page.path === '/lists'} sveltekit:prefetch href="/lists">Lists</a>
		<a class:active={$page.path === '/settings'} sveltekit:prefetch href="/settings">Settings</a
		>
		<hr />
		{#if $lists}
			{#each $lists as list}
				<a
					class:active={$page.path === `/lists/${list._id}`}
					sveltekit:prefetch
					href={`/lists/${list._id}`}>{list.name}</a
				>
			{/each}
		{/if}
	</div>
	<div class="add-list-container">
		<button class="add-list" on:click={() => addList()}>
			<i class="bi bi-plus-lg" />
			New list
		</button>
	</div>
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		width: 240px;
		background: var(--bg-color-2);
		padding: 20px 0 20px 20px;
		height: 100vh;
	}

	.scroll-container {
		padding-right: 20px;
		scrollbar-color: var(--bg-color-2) transparent;
	}

	a {
		color: inherit;
		text-decoration: none;
		padding: 10px;
		margin: 3px 0;
		border-radius: 12px;
	}
	a:hover {
		background: var(--bg-color-2-5);
	}
	a.active {
		background: var(--bg-color-2-5);
	}

	hr {
		width: calc(100% - 20px);
	}

	.logo {
		display: flex;
		align-items: center;
		margin: 0 20px 0 0;
	}
	.logo:hover {
		background: none;
	}
	.logo img {
		margin-left: -5px;
		width: 32px;
		height: 32px;
	}

	h1 {
		margin: 0 0 0 12px;
		font-size: 2rem;
	}

	.add-list-container {
		display: flex;
		margin-top: 10px;
	}

	.add-list {
		display: flex;
		align-items: center;
		padding: 10px;
		border-radius: 12px;
		margin-right: 20px;
		width: 100%;
		flex-shrink: 1;
	}
	.add-list:hover {
		background: var(--bg-color-2-5);
	}
	.add-list i {
		margin-right: 10px;
		font-size: 20px;
	}
</style>
