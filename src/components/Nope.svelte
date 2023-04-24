<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function onAnimationEnd() {
		dispatch('fade-out');
	}
</script>

<h2
	class="rotate-[-30deg] text-6xl text-orange-600 animate-fade-in-out absolute left-1/2 transform -translate-x-1/2"
	on:animationend={onAnimationEnd}
>
	Nope!
</h2>

<style>
	.animate-fade-in-out {
		animation: fade-out 1s ease-out;
	}

	@keyframes fade-out {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 0;
		}
	}
</style>
