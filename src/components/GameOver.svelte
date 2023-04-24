<script lang="ts">
	export let userWon: boolean;
	export let answer: string;
</script>

<div class="mt-2">
	{#if userWon}
		<h1 class="text-3xl font-bold">You won!</h1>
		<img src="trophy.png" alt="a golden trophy" class="mt-3 w-[100px] md:w-[200px] m-auto" />
	{:else}
		<h1 class="text-2xl font-bold">Better luck next time!</h1>
	{/if}
	<h2 class="mt-2">I was thinking of a {answer}.</h2>
	<button
		on:click={() => location.reload()}
		class="mt-2 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
		>Play again</button
	>
</div>
