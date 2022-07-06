<script lang="ts">
	import Dictionary from "./components/Dictionary.svelte";
	import Bookmark from "./components/Bookmark.svelte";
	import { bookmarkedWords } from "./store.js";
	import { fade, slide } from "svelte/transition";
    import VideoPlayer from 'svelte-video-player';

	let darkMode: boolean = false;
	let cardIsVisible:boolean = false;
    let cardIsBookmarked:boolean = false;
	let wordError: boolean = false;
	let wordEmpty: boolean = false;
	
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

			if (searchWord === '') {
				wordEmpty = true;
				setTimeout(() => { wordEmpty = false }, 3000);
				return;
			} else if (response.status === 404) {
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
	
	function toggleDarkMode() {
		darkMode = !darkMode;
		document.body.classList.toggle('dark');
		document.querySelector('.search-box')?.classList.toggle('dark');
    }

	const poster = '/assets/screen.png';
	const source = [
		'https://download-a.akamaihd.net/files/media_periodical/7a/jwbcov_E_201805_15_r480P.mp4',
		'https://download-a.akamaihd.net/files/media_periodical/e7/jwbcov_E_201805_15.vtt'
	]
</script>

<div class="video-wrapper">
	<VideoPlayer
		source="https://download-a.akamaihd.net/files/media_periodical/7a/jwbcov_E_201805_15_r480P.mp4"
		centerIconSize="300px"
		color='deepskyblue' />
</div>

{#if cardIsVisible}
<div transition:fade={{ duration: 200 }} on:click={() => cardIsVisible = false} class="blur"></div>
{/if}

<div class="dark-mode-btn" class:clicked={darkMode} on:click={() => toggleDarkMode()}>
	{#if !darkMode}
	🌞
	{:else}
	🌚
	{/if}
</div>

<div class="main">		
	<div class="img">
		<img width="200" src="/main.png" alt="No Bookmarks Found"/>
	</div>
	<form on:submit|preventDefault={() => getDictionaryDefinition(inputText)}>
		<h1 id="title">define.me!</h1>
        <input bind:value={inputText} type="text" placeholder="define a word..." class="search-box">
    </form>
	
	{#if wordError}
		<div transition:slide class="error-message">⚠ Please check spelling!</div>
	{/if}

	{#if wordEmpty}
		<div transition:slide class="error-message">⚠ Please add a word!</div>
	{/if}
	
	{#if cardIsVisible}
		<Dictionary bind:isDarkMode={darkMode}
					bind:definitionObject={definitionObject}
					bind:bookmarked={cardIsBookmarked}
					bind:visible={cardIsVisible}
					bind:bookmarkComponent={bookmarkComponent}/>
	{/if}
	
	<Bookmark bind:isDarkMode={darkMode}
			  bind:this={bookmarkComponent}
			  on:dispatchRedefine={redefineBookmarked}/>
</div>


<style>
	.video-wrapper {
		position: sticky;
		width: 851px;
		height: 479px;
		box-shadow: rgba(0, 0, 0, 0.469) 0px 5px 15px;
		border-radius: 8px;
		bottom: 1px;
	}
	.dark-mode-btn {
		position: absolute;
		top: 20px;
		right: 20px;
		font-size: 30px;
		cursor: pointer;
	}
	.dark-mode-btn.clicked {
		animation: flip;
		animation-duration: 0.4s;
	}

	:global(body) {
		background-color: #fff;
		transition: background-color 0.4s
	}
	:global(body.dark) {
		background-color: #111d24;
		color: white;
	}

	h1 {
		margin-top: 0;
		color: #ff9c7b;
		font-size: 3em;
		font-weight: 500;
		transition: color 1s
	}

	img {
        padding-top: 30px;
		mix-blend-mode: luminosity;
	}

	form {
		display: flex;
		justify-content: center;
	}
	input {
		margin-left: 30px;
		font-size: 30px;
		border: none;
		transition: background-color 0.4s;
		border-bottom: 1px solid rgb(175, 197, 216);
		color: rgb(175, 197, 216);
		width: 230px;
	}
	input:focus {
		outline: none;
	}
	:global(input.dark) {
		background-color: #111d24;
		color: white;
		border: none;
		border-bottom: 1px solid white;
	}
	::placeholder {
		color: rgb(175, 197, 216);
	}

	.error-message {
		margin: 0 auto;
		width: 200px;
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
		padding-top: 150px;
	}

	@media (min-width: 640px) {
		.main {
			max-width: 100%;
		}
	}
</style>