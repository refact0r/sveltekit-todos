<script context="module">
</script>

<script>
	import Welcome from '$lib/Welcome.svelte'
	import { session } from '$app/stores'
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

{#if $session.user}
	<div class="content">
		{#if $session.user.name}
			<h1>
				Welcome to SvelteKit Todos, {$session.user.name}
			</h1>
		{/if}
	</div>
{:else}
	<Welcome />
{/if}

<style>
	.content {
		padding: 40px;
	}

	h1 {
		width: 100%;
		margin-top: 0;
	}
	/* 
	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
		filter: saturate(0) invert(77%) sepia(38%) saturate(246%) hue-rotate(156deg) brightness(86%)
			contrast(89%);
	} */
</style>
