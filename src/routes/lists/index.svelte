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
	import { slide } from 'svelte/transition'
	import { quartOut } from 'svelte/easing'
	import { goto } from '$app/navigation'
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
		text = ''
		console.log(list)
		const res = await fetch(`/lists.json`, {
			method: 'POST',
			body: JSON.stringify(list)
		})
		const json = await res.json()
		$lists.push(json.list)
		$lists = $lists
	}

	async function editList(list, e) {
		if (e.target.value == '') {
			e.target.value = list.name
			return
		}
		list.name = e.target.value
		await fetch(`/lists.json`, {
			method: 'PUT',
			body: JSON.stringify(list)
		})
		loadLists()
	}

	async function deleteList(index) {
		const list = $lists.splice(index, 1)[0]
		lists.set($lists)
		await fetch(`/lists.json`, {
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
			<button class="icon-button-lg sync" on:click={() => loadLists()}
				><i class="bi bi-arrow-repeat" />
			</button>
		</div>
		<div class="item-container">
			{#if $lists}
				{#each $lists as list, index}
					<div class="list" transition:slide|local={{ duration: 400, easing: quartOut }}>
						<button
							class="icon-button goto"
							on:click={() => goto(`/lists/${$lists[index]._id}`)}
							><i class="bi bi-list" />
						</button>
						<input
							class="name"
							type="text"
							value={list.name}
							on:change={(e) => editList(list, e)}
							on:keydown={(e) => blurOnEnter(e)}
						/>
						<button class="icon-button delete" on:click={() => deleteList(index)}
							><i class="bi bi-x-lg" />
						</button>
					</div>
				{/each}
			{/if}
		</div>
		<div class="new-container">
			<form class="new" on:submit|preventDefault={addList}>
				<button class={'icon-button add' + (text ? ' active' : '')} type="submit">
					<i class="bi bi-plus-lg" />
				</button>
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

	.goto {
		margin-right: 12px;
	}

	.list {
		display: flex;
		background: var(--bg-color-2);
		align-items: center;
		border-radius: 12px;
		padding: 10px 12px;
		margin-bottom: 8px;
	}
</style>
