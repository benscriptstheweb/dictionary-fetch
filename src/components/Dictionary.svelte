<script lang="ts">
    import { bookmarkedWords } from '../store.js';
    import { fly } from 'svelte/transition';
    import 'animate.css';

    export let bookmarked: boolean = false;
    export let visible: boolean = false;
    export let isDarkMode: boolean = false;
    export let bookmarkComponent: any;
    export let definitionObject: any;
    
    function addBookmark() {
        bookmarked = !bookmarked
        localStorage.setItem(definitionObject.title, JSON.stringify(definitionObject));
        
        const element = <HTMLElement>document.querySelector('.definition-btn-bookmark');
        
        if (!$bookmarkedWords.includes(definitionObject.title) && definitionObject.title !== '') {
            $bookmarkedWords = [...$bookmarkedWords, definitionObject.title];
            element.classList.add('animate__animated', 'animate__heartBeat');
        }
        
        if (!bookmarked) {
            bookmarkComponent.deleteItem(definitionObject.title);
            element.classList.remove('animate__animated', 'animate__heartBeat');
            element.classList.add('animate__animated', 'animate__headShake');
        }   
    }
</script>

<div transition:fly={{y:80}} class="definition-card" class:dark={isDarkMode}>
    <p class="definition-head">
        <span class="definition-title">{definitionObject.title}</span><span class="definition-phonetic">{definitionObject.phonetic}</span>
    </p>

    <p class="definition-label">Definitions:</p>

    {#each definitionObject.definitions as definition, index}
        <div class="definitions">
            <p class="definition-text">{index + 1}. <span class="definition-type">{definition.partOfSpeech}:</span> {definition.text}</p>

            {#if definition.example !== undefined}
                <p class="definition-text definition-example">e.g: {definition.example}</p>
            {/if}
        </div>
    {/each}

    <div class="definition-control">
        <span class="definition-btn definition-btn-bookmark"
                class:bookmarked={bookmarked === true}
                on:click={() => addBookmark()}>♥
        </span>  
        <span class="definition-btn-close" on:click={() => visible = false}>close</span>
    </div>
</div>

<style>
    .definition-card {        
        z-index: 2;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        padding: 30px;
        border-radius: 15px;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        transition: opacity 0.2s ease-in-out;
    }
    .definition-card.dark {
        background-color: #162a36;
        color: white;
    }
    .definitions {
        margin-bottom: 40px;
    }
    .definition-head {
        text-align: left;
        margin-top: 10px;
        font-weight: bold;
        font-size: 30px;
    }
    .definition-phonetic {
        color: rgb(179, 179, 179);
        margin: 10px 0 0 10px;
    }
    .definition-label {
        text-align: left;
        margin-top: 10px;
        font-size: 20px;
    }
    .definition-type {
        font-style: italic;
    }
    .definition-text {
        text-align: left;
        margin-top: 10px;
        font-size: 15px;
    }
    .definition-example {
        font-style: italic;
        color: rgb(179, 179, 179)
    }
    .definition-control {
        display: flex;
    }
    .definition-btn {
        font-size: 30px;
        margin-right: 20px;
        transition: 0.2s;
        cursor: pointer;
    }
    .definition-btn-bookmark:hover {
        color: #ff3e00;
    }
    .bookmarked {
        color: #ff3e00;
    }
    .definition-btn-close {
        position: absolute;
        bottom: 10%;
        right: 5%;
        cursor: pointer;
        text-decoration: underline;
    }
</style>