<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { bookmarkedWords } from '../store.js';

    let dispatch = createEventDispatcher();

    $bookmarkedWords = [];
    
    function defineBookmarkedWord(wordToDefine: string) {
        dispatch('dispatchRedefine', {word: wordToDefine});
    }
    
    export { deleteItem };
    export let isDarkMode: boolean = false;
    
    function deleteItem(item: string) {
        localStorage.removeItem(item);
        $bookmarkedWords = $bookmarkedWords.filter(w => w !== item);
    }
</script>

<div class="bookmark-card" class:dark={isDarkMode}>
    {#if $bookmarkedWords.length !== 0}
        <h3>Bookmarked</h3>
    {/if}
    
    {#each $bookmarkedWords as item}
        <div on:click={() => defineBookmarkedWord(item)} class="entry">
            <span>{item}</span>
            <span class="delete-button" on:click|stopPropagation={() => deleteItem(item)}>✖</span>
        </div>
    {/each}
</div>

<style>   
    .bookmark-card {
        margin: 20px 30px 0 30px;
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
    }
    .bookmark-card.dark {
        color: white;
    }
        
    h3 {
        text-align: center;
        color: rgb(156, 179, 199);
        margin-top: 50px;
        font-weight: 100;
    }

    .entry {
        position: relative;
        display: inline-block;
        font-size: 15px;
        font-family: 'Courier New', Courier, monospace;
        margin: 0 20px 20px 0;
        padding: 7px 14px;
        border-radius: 25px;
        border: 1.5px solid rgb(175, 197, 216);
    }
    .entry:hover {
        color: white;
        background-color: rgb(175, 197, 216);
        transition: 0.3s;
        cursor: pointer;
    }

    .delete-button {
        font-size: 10px;
        padding: 6px 7px 3px 7px;
        cursor: pointer;
        color: #ff3e00;
        border-radius: 50px;
        transition: 0.2s;
    }
    .delete-button:hover {
        font-size: 15px;
        background-color: #ff3e00;
        color: white;
    }
</style>