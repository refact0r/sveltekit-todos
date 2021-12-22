<script context="module">
	export async function load({ session }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {}
	}
</script>

<script>
	import { session } from '$app/stores'
	import { lists, loadLists } from '$lib/stores/lists.js'
	let text = ''

	async function addList() {
		if (text == '') {
			return
		}
		const list = {
			name: text
		}
		console.log(list)
		await fetch(`/lists/${$session.user._id}.json`, {
			method: 'POST',
			body: JSON.stringify(list)
		})
		text = ''
		loadLists($session.user._id)
	}

	async function editList(list, e) {
		if (e.target.value == '') {
			e.target.value = list.name
			return
		}
		list.name = e.target.value
		await fetch(`/lists/${$session.user._id}.json`, {
			method: 'PUT',
			body: JSON.stringify(list)
		})
		loadLists($session.user._id)
	}

	async function deleteList(index) {
		const list = $lists.splice(index, 1)[0]
		lists.set($lists)
		await fetch(`/lists/${$session.user._id}.json`, {
			method: 'DELETE',
			body: JSON.stringify(list)
		})
	}

	function blurOnEnter(event) {
		if (event.keyCode === 13) {
			event.target.blur()
		}
	}
</script>

<svelte:head>
	<title>Lists</title>
</svelte:head>

<div class="content">
	<div class="scroll-container">
		<div class="heading-container">
			<h1>Lists</h1>
			<button class="sync" on:click={() => loadLists($session.user._id)}
				><i class="bi bi-arrow-repeat" /></button
			>
		</div>
		<div class="list-container">
			{#if $lists}
				{#each $lists as list, index}
					<div class="list">
						<input
							class="name"
							type="text"
							value={list.name}
							on:change={(e) => editList(list, e)}
							on:keydown={(e) => blurOnEnter(e)}
						/>
						<button class="delete" on:click={() => deleteList(index)}
							><i class="bi bi-x-lg" /></button
						>
					</div>
				{/each}
			{/if}
		</div>
		<div class="new-container">
			<form class="new" on:submit|preventDefault={addList}>
				<button class="add" type="submit"><i class="bi bi-plus-lg" /></button>
				<input class="name" type="text" placeholder="Add a list" bind:value={text} />
			</form>
		</div>
	</div>
</div>

<style>
	.content {
		position: relative;
		height: 100%;
		padding: 20px 0;
	}

	.scroll-container {
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		scrollbar-color: var(--bg-color-1-5) transparent;
		height: 100%;
	}

	.list-container {
		padding: 10px 40px 88px 40px;
	}

	button {
		background: transparent;
	}

	input {
		width: 100%;
		background: var(--bg-color-2);
		padding: 0;
	}

	.list {
		display: flex;
		background: var(--bg-color-2);
		align-items: center;
		border-radius: 12px;
		padding: 10px;
		margin-bottom: 8px;
	}

	.delete {
		margin-left: 10px;
		width: 24px;
		height: 24px;
		padding: 0;
		color: var(--sub-color);
	}
	.delete:hover {
		color: var(--font-color);
	}

	.name {
		background: none;
	}
	.name:focus {
		outline: none;
	}

	.heading-container {
		background: var(--bg-color-1);
		position: sticky;
		top: 0;
		width: 100%;
		padding: 20px 40px 10px 40px;
		border-radius: 18px;
		display: flex;
		align-items: center;
	}

	h1 {
		margin: 0;
		margin-right: auto;
	}

	.new-container {
		margin-top: auto;
		background: var(--bg-color-1);
		padding: 10px 40px 20px 40px;
		position: sticky;
		bottom: 0;
		width: 100%;
		border-radius: 18px;
	}

	.new {
		display: flex;
		background: var(--bg-color-2);
		align-items: center;
		border-radius: 12px;
		padding: 10px;
	}
	.new .name {
		width: 100%;
	}

	.add {
		width: 24px;
		height: 24px;
		padding: 0;
		margin-right: 10px;
		font-size: 20px;
		line-height: 20px;
		color: var(--sub-color);
	}
	.add:hover {
		color: var(--font-color);
	}

	.sync {
		width: 36px;
		height: 36px;
		background: var(--bg-color-2);
		border-radius: 10px;
	}
	.sync:hover {
		background-color: var(--bg-color-2-5);
	}

	.sync i {
		font-size: 20px;
	}
</style>
