<script>
	let shown = false
	let dateString = ''
	let timeString = ''

	export let edit = (date) => {}

	export function show(date) {
		dateString = ''
		timeString = ''
		if (date) {
			let str = new Date(new Date(date).toString().split('GMT')[0] + ' UTC')
				.toISOString()
				.substring(0, 16)
			dateString = str.substring(0, 10)
			timeString = str.substring(11, 16)
		}
		shown = true
	}

	function clear() {
		dateString = ''
		timeString = ''
		shown = false
		edit(null)
	}

	function set() {
		let date = null
		if (dateString) {
			if (timeString) {
				date = new Date(dateString + 'T' + timeString)
			} else {
				date = new Date(dateString + 'T23:59')
			}
		}
		shown = false
		edit(date)
	}
</script>

{#if shown}
	<div class="background" on:click|self={set}>
		<div class="modal">
			<h4>Due date</h4>
			<input class="date" type="date" bind:value={dateString} />
			<input class="time" type="time" bind:value={timeString} />
			<button on:click={clear}>Clear</button>
			<button on:click={set}>Ok</button>
		</div>
	</div>
{/if}

<style>
	h4 {
		margin: 0 0 20px 0;
	}

	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(3px);
		border-radius: 20px;
		display: flex;
	}

	.modal {
		margin: auto;
		padding: 20px;
		background: var(--bg-color-2);
		border-radius: 20px;
	}

	input {
		background: var(--bg-color-1);
		padding: 10px;
		border-radius: 12px;
		margin-left: 10px;
	}
	input:hover {
		background: var(--bg-color-1-5);
	}

	.date {
		margin-left: 0;
	}

	button {
		background: var(--bg-color-1);
		padding: 10px;
		border-radius: 12px;
		margin-left: 10px;
	}
	button:hover {
		background: var(--bg-color-1-5);
	}
</style>
