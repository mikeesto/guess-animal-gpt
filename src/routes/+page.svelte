<script lang="ts">
	import countries from '../data/countryList.json';

	// Pick a random country as the answer
	const answer = countries[Math.floor(Math.random() * countries.length)][1];

	// Pick 9 other countries to use as possible choices
	const countryChoices: string[] = [];

	while (countryChoices.length < 9) {
		const country = countries[Math.floor(Math.random() * countries.length)][1];
		if (country !== answer && !countryChoices.includes(country)) {
			countryChoices.push(country);
		}
	}

	// Add the answer to the list of choices and shuffle them
	countryChoices.push(answer);
	countryChoices.sort(() => Math.random() - 0.5);

	interface Questions {
		question: string;
		answer: string;
	}

	let mode: 'ASK' | 'GUESS' = 'ASK';
	let questions = [] as Questions[];
	let question = '';
	let guess: string;

	const handleSubmit = () => {};
</script>

<main>
	<h1>Where in the world am I?</h1>
	<table>
		<thead>
			<tr>
				<th>Question</th>
				<th>Answer</th>
			</tr>
		</thead>
		<tbody>
			{#each questions as question}
				<tr>
					<td>{question}</td>
					<td>Answer</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<select bind:value={mode}>
		<option value="ASK">Ask</option>
		<option value="GUESS">Guess</option>
	</select>
	<!-- <p>{mode}</p> -->
	<form on:submit|preventDefault={handleSubmit}>
		{#if mode === 'ASK'}
			<input type="text" placeholder="Ask a question..." name="question" bind:value={question} />
		{:else}
			<select bind:value={guess}>
				{#each countryChoices as country}
					<option value={country}>{country}</option>
				{/each}
			</select>
		{/if}
		<input type="submit" value={mode} />
	</form>

	<pre>{JSON.stringify(questions, null, 2)}</pre>
</main>
