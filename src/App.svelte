<script lang="ts">
	import Dictionary from "./Dictionary.svelte";
	import Bookmark from "./Bookmark.svelte";
	import { bookmarkedWords } from "./store.js";
	import { fade, slide } from "svelte/transition";

	let cardIsVisible:boolean = false;
    let cardIsBookmarked:boolean = false;
	let wordError: boolean = false;
	
	let inputText:string = '';
	let bookmarkComponent: any;
	
	let definitionObject = {
		title: '',
		phonetic: '',
		definitions: [{ 
			text: '', 
			example: '',
			partOfSpeech: '',
		}],
	}

	let dictionaryData: any = [];

	async function getDictionaryDefinition(searchWord: string) {       
		if (localStorage.getItem(searchWord) !== null) {
			definitionObject.title = searchWord;
			definitionObject.phonetic = JSON.parse(localStorage.getItem(searchWord)!).phonetic;
			definitionObject.definitions = JSON.parse(localStorage.getItem(searchWord)!).definitions;
		} else {
			const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`);

			if (response.status === 404 || searchWord === '') {
				wordError = true;
				setTimeout(() => { wordError = false }, 3000);
				return;
			}
			
			dictionaryData = await response.json();
			
			// Build the dictionary object
			definitionObject.title = dictionaryData[0].word;
			definitionObject.phonetic = (dictionaryData[0].phonetic !== undefined) ? dictionaryData[0].phonetic : '';		
			definitionObject.definitions = [];
			
			for (let i = 0; i < dictionaryData.length; i++) {
				definitionObject.definitions.push({
					text: dictionaryData[i].meanings[0].definitions[0].definition,
					example: dictionaryData[i].meanings[0].definitions[0].example,
					partOfSpeech: dictionaryData[i].meanings[0].partOfSpeech
				});
			} 
		}

		cardIsVisible = true;
		cardIsBookmarked = ($bookmarkedWords.includes(definitionObject.title)) ? true : false;
		inputText = '';
    }

	function redefineBookmarked(event: any) {
        getDictionaryDefinition(event.detail.word);
    }
</script>

{#if cardIsVisible}
<div transition:fade={{ duration: 200 }} on:click={() => cardIsVisible = false} class="blur"></div>
{/if}

<div class="main">
	<h1>define.me!</h1>
	<form on:submit|preventDefault={() => getDictionaryDefinition(inputText)}>
        <input bind:value={inputText} type="text" placeholder="define a word..." class="search-box">
        <button>🔍</button>
    </form>
	{#if wordError}
		<div transition:slide class="error-message">⚠ Please check spelling!</div>
	{/if}
	
	{#if cardIsVisible}
	<Dictionary bind:definitionObject={definitionObject}
				bind:bookmarked={cardIsBookmarked}
				bind:visible={cardIsVisible}
				bind:bookmarkComponent={bookmarkComponent}/>
	{/if}

	<Bookmark bind:this={bookmarkComponent}
			  on:dispatchRedefine={redefineBookmarked}/>
</div>

<style>
	h1 {
        margin-top: 0;
        padding-top: 30px;
		color: #ff9c7b;
		font-size: 3em;
		font-weight: 500;
	}
	.error-message {
		margin: 0 auto;
		width: 20%;
		color: #ff9c7b;;
		padding: 10px;
		border: 2px solid #ff9c7b;
	}
	.blur {
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
    }

	.main {
		z-index: 0;
		text-align: center;
		padding: 0;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.main {
			max-width: 100%;
		}
	}
</style>