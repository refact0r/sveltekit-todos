<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				status,
				error
			}
		}
	}
</script>

<script>
	export let status, error
</script>

<div class="content">
	<h1>{status}</h1>
	<div>{error}</div>
</div>

<style>
	h1 {
		margin-top: 0;
	}
	.content {
		padding: 40px;
	}
</style>
