<script lang="ts">
  import { fade } from "svelte/transition";
  import { afterUpdate } from "svelte";
  import animals from "../data/animals.json";
  import GameOver from "../components/GameOver.svelte";
  import Nope from "../components/Nope.svelte";
  import Footer from "../components/Footer.svelte";

  // Pick a random animal as the answer
  const answer = animals[Math.floor(Math.random() * animals.length)];

  // Pick 9 other animals to use as possible choices
  const animalChoices: string[] = [];

  while (animalChoices.length < 9) {
    const animal = animals[Math.floor(Math.random() * animals.length)];
    if (animal !== answer && !animalChoices.includes(animal)) {
      animalChoices.push(animal);
    }
  }

  // Add the answer to the list of choices and sort them
  animalChoices.push(answer);
  animalChoices.sort();

  let mode: "ASK" | "GUESS" = "ASK";
  let tableWrapper: HTMLDivElement;
  let questions = [] as { question: string; response: string }[];
  let inputQuestion = "";
  let inputGuess: string;
  let gameOver = false;
  let userWon = false;
  let showNope = false;
  let checked = false;
  let numGuesses = 0;
  let loading = false;

  $: if (checked) {
    mode = "GUESS";
  } else {
    mode = "ASK";
  }

  $: if (numGuesses === 2) {
    gameOver = true;
  }

  afterUpdate(() => {
    if (tableWrapper) {
      tableWrapper.scrollTo(0, tableWrapper.scrollHeight);
    }
  });

  const handleSubmit = async () => {
    if (mode === "ASK") {
      if (inputQuestion.trim() === "") return;

      loading = true;
      const { response } = await fetch("/api/askquestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer, question: inputQuestion }),
      }).then((res) => res.json());

      questions = [...questions, { question: inputQuestion, response }];
      inputQuestion = "";
      loading = false;
    } else {
      if (inputGuess === answer) {
        userWon = true;
        gameOver = true;
      } else {
        numGuesses++;
        showNope = true;
      }
    }
  };

  // questions.push({ question: 'Does it eat grass?', answer: 'No' });
  // questions.push({ question: 'Is it found in Africa?', answer: 'Yes' });
  // questions.push({ question: 'Does it eat grass?', answer: 'No' });
  // questions.push({ question: 'Is it found in Africa?', answer: 'Yes' });
</script>

<main
  class="mx-auto w-4/5 max-w-[800px] flex flex-col items-center mt-2 text-center"
>
  <img src="/earth.png" class="w-[100px] md:w-[200px]" alt="planet earth" />
  <h1
    class="mb-4 mt-1 text-3xl font-extrabold md:text-5xl md:leading-normal tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-blue-500"
  >
    I'm thinking of an animal...
  </h1>

  {#if questions.length === 0}
    <h2 class="mb-1">You can ask ten yes or no questions</h2>
    <h2 class="mb-1"><em>Is it a mammal?</em></h2>
    <h2 class="mb-1">When you think you know the answer, make a guess!</h2>
  {:else}
    <div class="max-h-[250px] overflow-auto w-full" bind:this={tableWrapper}>
      <table class="w-full">
        <thead class="text-xs text-gray-700 uppercase border-b-2">
          <tr>
            <th class="text-left">Question</th>
            <th class="">Answer</th>
          </tr>
        </thead>
        <tbody>
          {#each questions as { question, response }}
            <tr
              class="border-b"
              class:bg-green-50={response === "Yes."}
              class:bg-red-50={response === "No."}
              transition:fade
            >
              <td class="p-2 text-left">{question}</td>
              <td>{response}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if gameOver}
    <GameOver {answer} {userWon} />
  {:else}
    <div
      class="mt-4 mb-2 grid items-center grid-cols-[auto,1fr,1fr] sm:grid-cols-3 w-full"
    >
      <span
        >❓ <span class="sm:inline hidden">Questions left:</span>
        <strong>{10 - questions.length}</strong></span
      >
      <span
        >🔍 <span class="sm:inline hidden">Guesses left: </span><strong
          class="ml-2 sm:ml-0"
        >
          {2 - numGuesses}</strong
        ></span
      >
      <div class="flex items-center gap-2 justify-end">
        <span class="ml-3 text-sm font-medium text-gray-900">Ask</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" class="sr-only peer" bind:checked />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
          />
        </label>
        <span class="text-sm font-medium text-gray-900">Guess</span>
      </div>
    </div>

    <form
      on:submit|preventDefault={handleSubmit}
      class="flex w-full gap-2 mt-2 relative"
    >
      {#if mode === "ASK"}
        <input
          type="text"
          placeholder="Ask a question..."
          name="question"
          bind:value={inputQuestion}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 grow"
        />
      {:else}
        <select
          bind:value={inputGuess}
          class="bg-gray-50 text-center border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
        >
          {#each animalChoices as animal}
            <option value={animal}>{animal}</option>
          {/each}
        </select>
      {/if}
      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center disabled:bg-slate-400"
        disabled={questions.length === 10 || loading}>{mode}</button
      >

      {#if showNope}
        <Nope on:fade-out={() => (showNope = false)} />
      {/if}
    </form>
  {/if}
</main>
<Footer />
